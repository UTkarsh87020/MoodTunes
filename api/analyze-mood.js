/**
 * Serverless Function: Analyze Mood
 * Uses keyword-based sentiment analysis — no external API needed
 */

// Allowed language codes
const ALLOWED_LANGUAGES = ['en', 'hi', 'es'];

// Keyword dictionaries for mood detection
const MOOD_KEYWORDS = {
  happy: [
    'happy', 'joy', 'joyful', 'excited', 'great', 'amazing', 'wonderful',
    'fantastic', 'awesome', 'cheerful', 'elated', 'thrilled', 'delighted',
    'love', 'lovely', 'good', 'positive', 'blessed', 'grateful', 'smile',
    'laugh', 'fun', 'celebrate', 'party', 'euphoric', 'glad', 'ecstatic',
    'खुश', 'प्रसन्न', 'आनंद', 'feliz', 'alegre', 'contento'
  ],
  energetic: [
    'energetic', 'motivated', 'pumped', 'powerful', 'strong', 'workout',
    'exercise', 'run', 'hustle', 'grind', 'focused', 'determined', 'driven',
    'ambitious', 'productive', 'active', 'dynamic', 'fired up', 'charged',
    'ready', 'unstoppable', 'confident', 'bold', 'fierce',
    'ऊर्जा', 'शक्तिशाली', 'energético', 'fuerte'
  ],
  calm: [
    'calm', 'peaceful', 'relaxed', 'chill', 'serene', 'tranquil', 'quiet',
    'still', 'gentle', 'soft', 'easy', 'comfortable', 'cozy', 'mellow',
    'content', 'satisfied', 'balanced', 'mindful', 'meditate', 'breathe',
    'slow', 'tired', 'sleepy', 'lazy', 'bored', 'neutral', 'okay', 'fine',
    'शांत', 'calmado', 'tranquilo', 'relajado'
  ],
  sad: [
    'sad', 'unhappy', 'down', 'depressed', 'lonely', 'alone', 'miss',
    'missing', 'heartbroken', 'hurt', 'pain', 'cry', 'crying', 'tears',
    'lost', 'hopeless', 'gloomy', 'melancholy', 'blue', 'grief', 'grieve',
    'mourn', 'sorrow', 'empty', 'broken', 'failed', 'disappointed',
    'उदास', 'triste', 'solo', 'llorar'
  ],
  intense: [
    'angry', 'intense', 'furious', 'rage', 'mad', 'frustrated', 'annoyed',
    'irritated', 'aggressive', 'hate', 'hatred', 'violent', 'stressed',
    'anxious', 'overwhelmed', 'tense', 'nervous', 'worried', 'panic',
    'fear', 'scared', 'dark', 'heavy', 'pressure', 'chaos', 'battle',
    'fight', 'war', 'rebel', 'wild', 'explosive',
    'गुस्सा', 'enojado', 'furioso', 'estresado'
  ]
};

// Analyze mood from text using keyword matching + scoring
function analyzeMoodFromText(text) {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  // Count keyword hits per mood
  const scores = { happy: 0, energetic: 0, calm: 0, sad: 0, intense: 0 };

  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        scores[mood] += keyword.split(' ').length; // multi-word phrases score higher
      }
    }
  }

  // Find the mood with the highest score
  let topMood = 'calm'; // default
  let topScore = 0;

  for (const [mood, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score;
      topMood = mood;
    }
  }

  // Calculate a rough sentiment score (-1.0 to 1.0)
  const positiveScore = scores.happy + scores.energetic;
  const negativeScore = scores.sad + scores.intense;
  const total = positiveScore + negativeScore + scores.calm + 0.01;
  const sentimentScore = parseFloat(((positiveScore - negativeScore) / total).toFixed(2));

  // Calculate magnitude (how strong the emotion is)
  const magnitude = parseFloat(Math.min((topScore / 3), 1.0).toFixed(2));

  return { topMood, sentimentScore, magnitude, scores };
}

// Mood to genres mapping
const MOOD_GENRES = {
  happy:    ['pop', 'dance', 'happy', 'party'],
  energetic: ['rock', 'electronic', 'workout', 'upbeat'],
  calm:     ['ambient', 'chill', 'acoustic', 'indie'],
  sad:      ['sad', 'blues', 'indie', 'melancholic'],
  intense:  ['metal', 'hard rock', 'intense', 'aggressive']
};

module.exports = async (req, res) => {
  // Enable CORS
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, language = 'en' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const safeLanguage = ALLOWED_LANGUAGES.includes(language) ? language : 'en';

    // Run local keyword-based mood analysis
    const { topMood, sentimentScore, magnitude } = analyzeMoodFromText(text);

    return res.status(200).json({
      success: true,
      sentiment: {
        score: sentimentScore,
        magnitude: magnitude
      },
      mood: topMood,
      genres: MOOD_GENRES[topMood],
      originalText: text
    });

  } catch (error) {
    console.error('Error in analyze-mood:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
