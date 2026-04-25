/**
 * Serverless Function: Get Music Recommendations
 * Uses iTunes Search API — completely free, no API key required.
 * Spotify deprecated /search and /recommendations for new apps in 2024.
 */

// Allowed language codes
const ALLOWED_LANGUAGES = ['en', 'hi', 'es'];

// Mood → search terms for iTunes
const MOOD_SEARCH_TERMS = {
  happy:     ['happy upbeat pop', 'feel good dance', 'party pop hits'],
  energetic: ['high energy workout rock', 'electronic dance power', 'motivational rock'],
  calm:      ['chill acoustic relaxing', 'ambient peaceful meditation', 'soft indie folk'],
  sad:       ['sad emotional indie', 'melancholy blues acoustic', 'heartbreak soul'],
  intense:   ['intense metal rock', 'aggressive hard rock', 'dark powerful metal']
};

// iTunes storefront by language (country code)
const ITUNES_COUNTRY = {
  'en': 'US',
  'hi': 'IN',
  'es': 'ES'
};

/**
 * Search iTunes for tracks matching mood
 */
async function searchItunesTracks(mood, language = 'en') {
  const terms = MOOD_SEARCH_TERMS[mood] || MOOD_SEARCH_TERMS.calm;
  // Pick a random search term from the mood's list to add variety
  const randomTerm = terms[Math.floor(Math.random() * terms.length)];

  const country = ITUNES_COUNTRY[language] || 'US';

  const params = new URLSearchParams({
    term: randomTerm,
    media: 'music',
    entity: 'song',
    limit: 25,
    country: country,
    explicit: 'No'
  });

  const url = `https://itunes.apple.com/search?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`iTunes API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  // Filter to only tracks that have a preview URL
  const withPreview = data.results.filter(t => t.previewUrl);

  // Return up to 12 tracks
  return withPreview.slice(0, 12);
}

/**
 * Format iTunes track data for frontend
 */
function formatTracks(tracks, mood) {
  return tracks.map(track => ({
    id: String(track.trackId),
    name: track.trackName,
    artist: track.artistName,
    album: track.collectionName || '',
    albumArt: track.artworkUrl100
      ? track.artworkUrl100.replace('100x100', '300x300')
      : '',
    previewUrl: track.previewUrl,
    spotifyUrl: track.trackViewUrl, // iTunes track URL instead
    duration: track.trackTimeMillis || 0,
    mood: mood
  }));
}

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
    const { genres, mood, language = 'en' } = req.body;

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      return res.status(400).json({ error: 'Genres array is required' });
    }

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    const safeLanguage = ALLOWED_LANGUAGES.includes(language) ? language : 'en';

    // Search iTunes for tracks matching the mood
    const tracks = await searchItunesTracks(mood, safeLanguage);

    // Format and return
    const formattedTracks = formatTracks(tracks, mood);

    return res.status(200).json({
      success: true,
      mood: mood,
      genres: genres,
      tracks: formattedTracks,
      count: formattedTracks.length
    });

  } catch (error) {
    console.error('Error in get-recommendations:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
