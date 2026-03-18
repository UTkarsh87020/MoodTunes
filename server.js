const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Import API functions
const analyzeMood = require('./api/analyze-mood.js');
const getRecommendations = require('./api/get-recommendations.js');

const PORT = 3000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

// Create server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API routes
  if (pathname === '/api/analyze-mood') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          req.body = JSON.parse(body);
          // Create mock response object
          const mockRes = {
            statusCode: 200,
            headers: {},
            setHeader: function(name, value) {
              this.headers[name] = value;
            },
            status: function(code) {
              this.statusCode = code;
              return this;
            },
            json: function(data) {
              res.writeHead(this.statusCode, { 'Content-Type': 'application/json', ...this.headers });
              res.end(JSON.stringify(data));
            },
            end: function() {
              res.end();
            }
          };
          await analyzeMood(req, mockRes);
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Server error', message: error.message }));
        }
      });
    }
    return;
  }

  if (pathname === '/api/get-recommendations') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          req.body = JSON.parse(body);
          // Create mock response object
          const mockRes = {
            statusCode: 200,
            headers: {},
            setHeader: function(name, value) {
              this.headers[name] = value;
            },
            status: function(code) {
              this.statusCode = code;
              return this;
            },
            json: function(data) {
              res.writeHead(this.statusCode, { 'Content-Type': 'application/json', ...this.headers });
              res.end(JSON.stringify(data));
            },
            end: function() {
              res.end();
            }
          };
          await getRecommendations(req, mockRes);
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Server error', message: error.message }));
        }
      });
    }
    return;
  }

  // Static file serving
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, 'public', filePath);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    // Get file extension
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1>');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🎵 MoodTunes server running at http://localhost:${PORT}`);
  console.log('📝 Note: You need to add your API keys to .env file for full functionality');
  console.log('🔑 Required: GOOGLE_NLP_API_KEY, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET');
});