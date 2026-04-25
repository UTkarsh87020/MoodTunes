/**
 * Local development server for MoodTunes
 * Mimics Vercel's serverless function routing locally
 */
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Parse JSON bodies (needed for API handlers)
app.use(express.json());

// --- Mount API routes (Vercel serverless functions) ---
const analyzeMood = require('./api/analyze-mood');
const getRecommendations = require('./api/get-recommendations');

// Wrap Vercel-style module.exports = async (req, res) => {} handlers
function vercelAdapter(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error('API error:', err);
      res.status(500).json({ error: 'Internal server error', message: err.message });
    }
  };
}

app.all('/api/analyze-mood', vercelAdapter(analyzeMood));
app.all('/api/get-recommendations', vercelAdapter(getRecommendations));

// --- Serve static files from /public ---
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback — Express 5 compatible
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🎵 MoodTunes running at: http://localhost:${PORT}\n`);
});
