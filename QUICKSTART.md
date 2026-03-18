# MoodTunes - Quick Start Guide

Get MoodTunes running locally in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Get API Keys

#### Google Cloud NLP API Key
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable "Cloud Natural Language API"
4. Create credentials → API Key
5. Copy the key

#### Spotify API Credentials
1. Go to https://developer.spotify.com/dashboard
2. Create an app
3. Copy Client ID and Client Secret

### 3. Configure Environment
```bash
# Create .env file
copy .env.example .env

# Edit .env and add your keys:
GOOGLE_NLP_API_KEY=your_google_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 4. Run Locally
```bash
# Install Vercel CLI globally
npm install -g vercel

# Start development server
vercel dev
```

### 5. Open Browser
Navigate to: http://localhost:3000

## 🎯 How It Works

### User Flow
1. **Landing Page** → Click "Start Listening"
2. **Mood Input** → Describe your mood (e.g., "I feel happy and energetic")
3. **Analysis** → AI analyzes sentiment and emotion
4. **Results** → Get personalized music recommendations
5. **Play** → Click any song to play 30-second preview

### Technical Flow
```
User Input
    ↓
Frontend (script.js)
    ↓
Serverless Function (analyze-mood.js)
    ↓
Google NLP API → Sentiment Analysis
    ↓
Mood Classification (happy, sad, calm, etc.)
    ↓
Serverless Function (get-recommendations.js)
    ↓
Spotify API → Search Tracks
    ↓
Display Results + Audio Playback
```

## 🔧 Project Structure

```
MoodTunes/
├── api/                          # Serverless Functions
│   ├── analyze-mood.js          # Google NLP integration
│   └── get-recommendations.js   # Spotify integration
├── public/                       # Frontend Files
│   ├── index.html               # Main HTML
│   ├── styles.css               # Styling & animations
│   └── script.js                # Frontend logic
├── .env                         # Environment variables (create this)
├── .env.example                 # Template for .env
├── package.json                 # Dependencies
├── vercel.json                  # Vercel configuration
└── README.md                    # Documentation
```

## 🎨 Features

- ✅ AI-powered mood analysis
- ✅ Multi-language support (English, Hindi, Spanish)
- ✅ Real-time music recommendations
- ✅ Instant audio playback
- ✅ Modern animated UI
- ✅ Fully responsive design
- ✅ Dark theme

## 🧪 Testing

### Test Mood Inputs
Try these examples:

**Happy Mood**
```
I feel amazing and full of energy today!
```

**Calm Mood**
```
I'm feeling peaceful and relaxed
```

**Sad Mood**
```
I'm feeling down and melancholic
```

**Energetic Mood**
```
I'm pumped up and ready to conquer the world!
```

**Intense Mood**
```
I'm feeling angry and frustrated
```

### Expected Results
- Sentiment score between -1.0 (negative) and 1.0 (positive)
- Mood classification (happy, calm, sad, energetic, intense)
- 12 music recommendations
- Playable 30-second previews

## 🐛 Common Issues

### "API key not configured"
- Check if .env file exists
- Verify environment variables are set correctly
- Restart `vercel dev` after changing .env

### "Failed to analyze mood"
- Ensure Google NLP API is enabled
- Check if billing is enabled in Google Cloud
- Verify API key is correct

### "Failed to get recommendations"
- Verify Spotify credentials are correct
- Check if Client ID and Secret have no extra spaces
- Ensure Spotify API is accessible

### No audio playback
- Some tracks don't have preview URLs
- Click "Open in Spotify" to listen on Spotify
- Check browser console for errors

## 📝 API Integration Details

### Google Cloud NLP API

**Endpoint**: `https://language.googleapis.com/v1/documents:analyzeSentiment`

**Request**:
```json
{
  "document": {
    "type": "PLAIN_TEXT",
    "language": "en",
    "content": "I feel happy and energetic"
  }
}
```

**Response**:
```json
{
  "documentSentiment": {
    "score": 0.8,
    "magnitude": 0.9
  }
}
```

**Mood Mapping**:
- Score > 0.5 → Happy (pop, dance, happy)
- Score > 0.25 → Energetic (rock, electronic)
- Score -0.25 to 0.25 → Calm (ambient, chill)
- Score < -0.25 → Sad (sad, blues, indie)
- Score < -0.5 → Intense (metal, hard rock)

### Spotify Web API

**Auth Endpoint**: `https://accounts.spotify.com/api/token`

**Search Endpoint**: `https://api.spotify.com/v1/search`

**Request**:
```
GET /v1/search?q=genre:"pop"&type=track&limit=12
Authorization: Bearer {access_token}
```

**Response**: Array of track objects with:
- Track name, artist, album
- Album artwork
- Preview URL (30-second clip)
- Spotify URL

## 🚀 Deploy to Production

### Quick Deploy with Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add GOOGLE_NLP_API_KEY
vercel env add SPOTIFY_CLIENT_ID
vercel env add SPOTIFY_CLIENT_SECRET

# Deploy to production
vercel --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide.

## 🎓 Learning Resources

### APIs Used
- [Google Cloud NLP Documentation](https://cloud.google.com/natural-language/docs)
- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

### Technologies
- HTML5, CSS3, Vanilla JavaScript
- Node.js (Serverless Functions)
- RESTful API integration
- Async/Await patterns

## 💡 Customization Ideas

### Easy Customizations
1. **Change color scheme** → Edit CSS variables in `styles.css`
2. **Add more languages** → Update language dropdown in `index.html`
3. **Adjust mood mapping** → Modify `classifyMood()` in `analyze-mood.js`
4. **Change track limit** → Update `limit` parameter in `get-recommendations.js`

### Advanced Features
1. User authentication
2. Save favorite tracks
3. Create playlists
4. Social sharing
5. Mood history tracking
6. Advanced analytics

## 📞 Support

Having issues? Check:
1. Browser console for errors
2. Vercel function logs: `vercel logs`
3. API quotas in respective dashboards
4. [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section

## 📄 License

MIT License - Free to use and modify!

---

Happy coding! 🎵✨
