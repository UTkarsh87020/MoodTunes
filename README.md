# 🎵 MoodTunes — AI-Powered Mood-Based Music App

> Describe how you feel. Get the perfect soundtrack. Instantly.

MoodTunes is a full-stack music streaming web app that uses AI to analyze your mood from plain text and serves perfectly matched music recommendations — powered by a local keyword-based NLP engine and the iTunes Search API.

---

## ✨ Features

### 🎨 UI & Experience
- **3 Premium Themes** — Antigravity Dark, Cloud Nine (light), Neon Dreams (cyberpunk)
- **Glassmorphism design** with animated gradient orbs and glow effects
- **Smooth animations** — page transitions, micro-interactions, staggered lists
- **Fully responsive** — mobile, tablet, desktop (640 / 768 / 1024 / 1280px)
- **DM Sans + Plus Jakarta Sans** typography — no generic fonts

### 📄 8 Pages
| Page | Highlights |
|---|---|
| **Login** | Floating glass card, orb background, Google & Spotify social buttons |
| **Register** | 3-step flow with progress indicator, real-time username checker |
| **Player** (Home) | Mood analyzer, song list, draggable queue, AI music fetch |
| **Search / Discover** | Genre grid, trending songs, mood-based live search |
| **Profile** | Banner, avatar, listening stats, top artists, liked songs |
| **Settings** | Theme preview cards, audio quality, notifications, language |
| **About** | Animated hero, feature cards, animated stats counter, team section |
| **Privacy Policy** | Sticky TOC, collapsible accordion sections |

### 🎵 Music Player
- Persistent bottom mini-player bar
- Play / Pause / Skip / Previous / Shuffle / Repeat controls
- Progress bar with click-to-seek
- Volume slider + mute toggle
- Like / Heart button per song
- Draggable queue panel with drag-and-drop reordering
- Audio visualizer bars animation

### 🤖 AI Mood Engine
- **Local keyword-based NLP** — no external API, no billing, no rate limits
- Supports **English, Hindi, Spanish**
- Maps mood → genre → music in real time
- Mood themes dynamically shift UI colors (happy = warm, intense = red, etc.)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite 6 |
| **Routing** | React Router DOM v6 (hash routing) |
| **State** | React Context + useReducer |
| **Styling** | Vanilla CSS + CSS Custom Properties (3 themes) |
| **Icons** | Lucide React |
| **API Server** | Express.js (local dev) / Vercel Serverless Functions (prod) |
| **Music API** | iTunes Search API (free, no key required) |
| **Mood Analysis** | Local keyword engine (`api/analyze-mood.js`) |
| **Fonts** | DM Sans + Plus Jakarta Sans (Google Fonts) |

---

## 📁 Project Structure

```
MoodTunes/
├── api/
│   ├── analyze-mood.js          # Keyword-based mood NLP (no external API)
│   └── get-recommendations.js   # iTunes Search API integration
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Router + providers
│   ├── index.css                # Global CSS + 3 theme variables
│   ├── contexts/
│   │   ├── ThemeContext.jsx      # Theme state + localStorage persistence
│   │   ├── PlayerContext.jsx     # Playback state, queue, liked songs
│   │   └── AuthContext.jsx       # Mock auth (login / register / logout)
│   ├── data/
│   │   └── mockData.js           # Demo songs, playlists, genres, user
│   ├── components/
│   │   ├── layout/
│   │   │   └── Sidebar.jsx       # Nav, library, playlists, user footer
│   │   └── player/
│   │       ├── MiniPlayer.jsx    # Bottom player bar
│   │       └── Queue.jsx         # Drag-and-drop queue panel
│   └── pages/
│       ├── LoginPage.jsx
│       ├── RegisterPage.jsx
│       ├── PlayerPage.jsx
│       ├── SearchPage.jsx
│       ├── ProfilePage.jsx
│       ├── SettingsPage.jsx
│       ├── AboutPage.jsx
│       └── PrivacyPage.jsx
├── public/
│   └── favicon.svg
├── index.html                   # Vite root HTML
├── vite.config.js               # Vite config + API proxy
├── server.js                    # Express dev server (serves API locally)
├── vercel.json                  # Vercel deployment config
├── .env                         # Local env vars (not committed)
├── .env.example                 # Env template
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd MoodTunes
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` — Spotify credentials are optional (iTunes is used for music):

```env
# Spotify Web API (optional — iTunes is the primary music source)
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

### 3. Run Locally

Open **two terminals**:

```bash
# Terminal 1 — React frontend (Vite)
npm run dev
# → http://localhost:5173

# Terminal 2 — API server (Express)
node server.js
# → http://localhost:3000 (proxied via Vite automatically)
```

Then open **http://localhost:5173** in your browser.

> **Login with any email + password** — authentication is mocked locally.

---

## 🎨 Theme System

Themes are applied via `data-theme` on `<html>` and stored in `localStorage`:

| Theme | Background | Primary | Accent |
|---|---|---|---|
| 🌌 **Antigravity Dark** | `#0a0a0f` | `#00d4ff` (cyan) | `#ff006e` (magenta) |
| ☁️ **Cloud Nine** | `#f0f2f8` | `#0066ff` (blue) | `#ff6b6b` (coral) |
| ⚡ **Neon Dreams** | `#000000` | `#39ff14` (green) | `#00ffff` (cyan) |

Switch themes at **Settings → Appearance**.

---

## 🤖 How the AI Mood Engine Works

```
User types: "I feel happy and energetic today!"
        ↓
analyze-mood.js — keyword scoring across 5 moods:
  happy: 2 hits  energetic: 1 hit  calm: 0  sad: 0  intense: 0
        ↓
Top mood: "happy" → genres: ["pop","dance","happy"]
sentiment score: +0.75  magnitude: 0.67
        ↓
get-recommendations.js — iTunes Search API
  query: "happy upbeat pop"  market: US  limit: 12
        ↓
12 real tracks with 30s previews + album art returned
```

### Mood → Genre Mapping

| Mood | Genres | iTunes Search Term |
|---|---|---|
| Happy | pop, dance, happy | `happy upbeat pop` |
| Energetic | rock, electronic, workout | `high energy workout rock` |
| Calm | ambient, chill, acoustic | `chill acoustic relaxing` |
| Sad | blues, indie, melancholic | `sad emotional indie` |
| Intense | metal, hard rock, aggressive | `intense metal rock` |

---

## ☁️ Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "feat: full React rebuild with 8 pages and 3 themes"
git push origin main
```

### 2. Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"** → Import your GitHub repo
3. Add environment variables (optional — only needed for Spotify):
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
4. Click **Deploy** ✅

The `vercel.json` routes all `/api/*` requests to serverless functions and serves the Vite build for everything else.

### 3. Deploy via CLI

```bash
npm run build       # Build Vite React app → dist/
vercel --prod       # Deploy to production
```

---

## 🔧 API Reference

### `POST /api/analyze-mood`

Analyzes mood from plain text using local keyword matching.

**Request:**
```json
{ "text": "I feel happy and energetic today!", "language": "en" }
```

**Response:**
```json
{
  "success": true,
  "mood": "happy",
  "genres": ["pop", "dance", "happy"],
  "sentiment": { "score": 0.75, "magnitude": 0.67 }
}
```

### `POST /api/get-recommendations`

Fetches real music tracks from iTunes matching the mood.

**Request:**
```json
{ "genres": ["pop", "dance"], "mood": "happy", "language": "en" }
```

**Response:**
```json
{
  "success": true,
  "mood": "happy",
  "tracks": [
    {
      "id": "123",
      "name": "Track Name",
      "artist": "Artist",
      "album": "Album",
      "albumArt": "https://...",
      "previewUrl": "https://audio-ssl.itunes.apple.com/...",
      "spotifyUrl": "https://music.apple.com/...",
      "duration": 200000
    }
  ],
  "count": 12
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 640px` | Single column, bottom nav |
| `640–768px` | Compact sidebar, adjusted spacing |
| `768–1024px` | Collapsible sidebar, full player |
| `> 1024px` | Full 3-column layout (sidebar + content + queue) |

---

## 🔮 Future Enhancements

- [ ] Real OAuth authentication (Google, Spotify)
- [ ] Backend user database (playlists, history, preferences)
- [ ] Spotify Premium integration for full track playback
- [ ] Voice input for mood description
- [ ] Mood history & analytics dashboard
- [ ] Social features — share playlists, follow friends
- [ ] PWA support (offline mode, install to home screen)
- [ ] Advanced AI mood detection (fine-tuned language model)
- [ ] Apple Music / YouTube Music integration
- [ ] Collaborative mood playlists

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Credits

Built with ❤️ using:
- [React](https://react.dev) + [Vite](https://vite.dev)
- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/) — free music data
- [Lucide React](https://lucide.dev) — icons
- [Google Fonts](https://fonts.google.com) — DM Sans, Plus Jakarta Sans
- [Vercel](https://vercel.com) — hosting & serverless functions
