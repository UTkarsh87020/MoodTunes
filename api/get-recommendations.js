/**
 * Serverless Function: Get Music Recommendations
 * Uses Spotify Web API to fetch songs based on mood/genres
 */

// Allowed language codes
const ALLOWED_LANGUAGES = ['en', 'hi', 'es'];

// Get Spotify access token using Client Credentials flow
async function getSpotifyToken(clientId, clientSecret) {
  const tokenUrl = 'https://accounts.spotify.com/api/token';

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Search for tracks on Spotify
async function searchTracks(accessToken, genres, mood, language = 'en') {
  const searchUrl = 'https://api.spotify.com/v1/search';

  // Build a valid Spotify genre query — each genre must be quoted separately
  const genreQuery = genres
    .slice(0, 2)
    .map(g => `genre:"${g}"`)
    .join(' OR ');
  const query = `${genreQuery} ${mood}`;

  // Language-specific market codes
  const marketMap = {
    'en': 'US',
    'hi': 'IN',
    'es': 'ES'
  };
  const market = marketMap[language] || 'US';

  const params = new URLSearchParams({
    q: query,
    type: 'track',
    market: market,
    limit: 12
  });

  const response = await fetch(`${searchUrl}?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to search tracks on Spotify');
  }

  const data = await response.json();

  // Guard against unexpected API response shape
  if (!data.tracks || !Array.isArray(data.tracks.items)) {
    return [];
  }

  return data.tracks.items;
}

// Format track data for frontend
function formatTracks(tracks, mood) {
  return tracks.map(track => ({
    id: track.id,
    name: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    album: track.album.name,
    albumArt: track.album.images[0]?.url || '',
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
    duration: track.duration_ms,
    mood: mood
  }));
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
    const { genres, mood, language = 'en' } = req.body;

    // Validate genres input
    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      return res.status(400).json({ error: 'Genres array is required' });
    }

    // Validate mood input
    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    // Validate language — whitelist only supported codes
    const safeLanguage = ALLOWED_LANGUAGES.includes(language) ? language : 'en';

    // Get Spotify credentials from environment
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'Spotify credentials not configured' });
    }

    // Get Spotify access token
    const accessToken = await getSpotifyToken(clientId, clientSecret);

    // Search for tracks
    const tracks = await searchTracks(accessToken, genres, mood, safeLanguage);

    // Format and return results
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
