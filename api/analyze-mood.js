/**
 * Serverless Function: Analyze Mood
 * Uses Google Cloud Natural Language API to analyze sentiment and emotion
 */

// Allowed language codes supported by Google NLP
const ALLOWED_LANGUAGES = ['en', 'hi', 'es'];

// Mood classification based on sentiment score AND magnitude
function classifyMood(score, magnitude) {
  if (score > 0.5) {
    return { mood: 'happy', genres: ['pop', 'dance', 'happy', 'party'] };
  } else if (score > 0.25) {
    return { mood: 'energetic', genres: ['rock', 'electronic', 'workout', 'upbeat'] };
  } else if (score >= -0.25) {
    return { mood: 'calm', genres: ['ambient', 'chill', 'acoustic', 'indie'] };
  } else if (score >= -0.5 && magnitude < 1.0) {
    // Low magnitude negative = genuinely sad/blue
    return { mood: 'sad', genres: ['sad', 'blues', 'indie', 'melancholic'] };
  } else {
    // High magnitude negative = intense/angry
    return { mood: 'intense', genres: ['metal', 'hard rock', 'intense', 'aggressive'] };
  }
}

module.exports = async (req, res) => {
  // Enable CORS — restrict to same Vercel origin in production
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, language = 'en' } = req.body;

    // Validate text input
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Validate language — whitelist only supported codes
    const safeLanguage = ALLOWED_LANGUAGES.includes(language) ? language : 'en';

    // Get API key from environment
    const apiKey = process.env.GOOGLE_NLP_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Prepare request to Google NLP API
    const nlpUrl = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`;

    const requestBody = {
      document: {
        type: 'PLAIN_TEXT',
        language: safeLanguage,
        content: text
      },
      encodingType: 'UTF8'
    };

    // Call Google NLP API using native fetch (Node 20 built-in)
    const response = await fetch(nlpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google NLP API Error:', errorData);
      return res.status(response.status).json({
        error: 'Failed to analyze mood',
        details: errorData.error?.message || 'Unknown error'
      });
    }

    const data = await response.json();

    // Extract sentiment data
    const sentiment = data.documentSentiment;
    const score = sentiment.score;       // Range: -1.0 (negative) to 1.0 (positive)
    const magnitude = sentiment.magnitude; // Strength of emotion

    // Classify mood using both score and magnitude
    const moodData = classifyMood(score, magnitude);

    // Return analysis results
    return res.status(200).json({
      success: true,
      sentiment: {
        score: score,
        magnitude: magnitude
      },
      mood: moodData.mood,
      genres: moodData.genres,
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
