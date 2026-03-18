# MoodTunes – AI Powered Mood-Based Music Web App

A modern web application that analyzes your mood using Google Cloud Natural Language API and recommends personalized music from Spotify with instant playback.

## Features

- 🎭 AI-powered mood analysis using Google Cloud NLP
- 🎵 Personalized music recommendations from Spotify
- 🌍 Multi-language support (English, Hindi, Spanish)
- 🎨 Modern, animated dark theme UI
- 🔊 Instant background music playback
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6)
- **Backend**: Vercel Serverless Functions (Node.js)
- **APIs**: Google Cloud Natural Language API, Spotify Web API

## Project Structure

```
MoodTunes/
├── api/
│   ├── analyze-mood.js       # Google NLP API integration
│   └── get-recommendations.js # Spotify API integration
├── public/
│   ├── index.html            # Main HTML file
│   ├── styles.css            # Styling and animations
│   └── script.js             # Frontend logic
├── .env.example              # Environment variables template
├── vercel.json               # Vercel configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## Setup Instructions

### Prerequisites

1. Node.js (v14 or higher)
2. Google Cloud account with Natural Language API enabled
3. Spotify Developer account

### API Setup

#### 1. Google Cloud Natural Language API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Natural Language API
4. Create credentials (API Key)
5. Copy the API key

#### 2. Spotify Web API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy Client ID and Client Secret
4. Add redirect URI: `http://localhost:3000` (for local) and your Vercel domain (for production)

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd MoodTunes
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in root directory:
```env
GOOGLE_NLP_API_KEY=your_google_api_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

4. Install Vercel CLI:
```bash
npm install -g vercel
```

5. Run locally:
```bash
vercel dev
```

6. Open browser at `http://localhost:3000`

## Deployment to Vercel

### Method 1: Vercel CLI

1. Login to Vercel:
```bash
vercel login
```

2. Deploy:
```bash
vercel
```

3. Add environment variables:
```bash
vercel env add GOOGLE_NLP_API_KEY
vercel env add SPOTIFY_CLIENT_ID
vercel env add SPOTIFY_CLIENT_SECRET
```

4. Deploy to production:
```bash
vercel --prod
```

### Method 2: Vercel Dashboard

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables in project settings
6. Deploy

## How It Works

### 1. Mood Analysis Flow

```
User Input → Frontend → Serverless Function → Google NLP API
                                                    ↓
                                            Sentiment Analysis
                                                    ↓
                                            Mood Classification
```

### 2. Music Recommendation Flow

```
Mood Data → Serverless Function → Spotify API → Get Access Token
                                                        ↓
                                                Search Tracks
                                                        ↓
                                                Return Results
```

### 3. Mood to Genre Mapping

- **Happy/Joyful** (score > 0.5): Pop, Dance, Happy
- **Energetic** (score > 0.3): Rock, Electronic, Workout
- **Calm/Peaceful** (score 0 to 0.3): Ambient, Chill, Acoustic
- **Sad/Melancholic** (score < 0): Sad, Blues, Indie
- **Angry/Intense** (score < -0.5): Metal, Hard Rock, Intense

## API Integration Details

### Google Cloud NLP API

- **Endpoint**: `https://language.googleapis.com/v1/documents:analyzeSentiment`
- **Method**: POST
- **Purpose**: Analyzes text sentiment and returns score (-1 to 1) and magnitude

### Spotify Web API

- **Auth Endpoint**: `https://accounts.spotify.com/api/token`
- **Search Endpoint**: `https://api.spotify.com/v1/search`
- **Method**: GET
- **Purpose**: Searches tracks based on mood-mapped genres

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_NLP_API_KEY` | Google Cloud NLP API key | Yes |
| `SPOTIFY_CLIENT_ID` | Spotify app client ID | Yes |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret | Yes |

## Future Enhancements

- [ ] User authentication and profile management
- [ ] Save favorite mood-music combinations
- [ ] Playlist creation and management
- [ ] Social sharing features
- [ ] Advanced mood detection using facial recognition
- [ ] Integration with more music platforms (Apple Music, YouTube Music)
- [ ] Mood history and analytics dashboard
- [ ] Voice input for mood description
- [ ] Collaborative mood playlists
- [ ] Machine learning for personalized recommendations
- [ ] Dark/Light theme toggle
- [ ] Offline mode with cached recommendations
- [ ] Integration with smart home devices

## Troubleshooting

### API Key Issues
- Ensure all environment variables are set correctly
- Check API quotas in respective dashboards
- Verify API keys are active and have proper permissions

### CORS Errors
- Serverless functions handle CORS automatically
- Ensure you're using the correct API endpoints

### Spotify Playback Issues
- Spotify Web Playback SDK requires Spotify Premium
- For demo purposes, preview URLs are used (30-second clips)

## License

MIT License - feel free to use this project for learning and development.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using AI-powered mood analysis and music recommendation
