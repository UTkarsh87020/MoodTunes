import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, TrendingUp, Play, Loader } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { mockGenres, mockSongs } from '../data/mockData';

function SongCard({ song }) {
  const { playSong } = usePlayer();
  return (
    <div className="track-card" onClick={() => playSong(song, mockSongs)}>
      <img src={song.coverUrl} alt={song.title} />
      <div className="track-card-overlay"><button className="play-btn-card"><Play size={20} /></button></div>
      <div className="track-card-body">
        <div className="track-card-title">{song.title}</div>
        <div className="track-card-artist">{song.artist}</div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [moodInput, setMoodInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResults, setApiResults] = useState(null);
  const { playSong, setQueue } = usePlayer();

  const filtered = query
    ? mockSongs.filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.artist.toLowerCase().includes(query.toLowerCase()))
    : [];

  const search = async () => {
    if (!moodInput.trim()) return;
    setLoading(true);
    try {
      const r1 = await fetch('/api/analyze-mood', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: moodInput }) });
      const mood = await r1.json();
      const r2 = await fetch('/api/get-recommendations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ genres: mood.genres, mood: mood.mood }) });
      const recs = await r2.json();
      const tracks = (recs.tracks || []).map(t => ({ ...t, title: t.name, coverUrl: t.albumArt || 'https://placehold.co/300x300/001020/00d4ff?text=🎵' }));
      setApiResults({ mood: mood.mood, tracks });
      if (tracks.length) { setQueue(tracks); playSong(tracks[0], tracks); }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="page">
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Discover</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 28 }}>Find music that matches your vibe</p>

      {/* Mood Search */}
      <div className="glass" style={{ padding: 20, marginBottom: 28, display: 'flex', gap: 12 }}>
        <input className="input" placeholder="Describe your mood... (e.g. happy and energetic)" value={moodInput}
          onChange={e => setMoodInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={search} disabled={loading}>
          {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : '🎵'} Find Music
        </button>
      </div>

      {/* Text search */}
      <div className="input-wrap" style={{ marginBottom: 28 }}>
        <SearchIcon size={18} className="icon" />
        <input className="input has-icon" placeholder="Search songs, artists..." value={query} onChange={e => setQuery(e.target.value)} style={{ fontSize: '1rem', padding: '14px 16px 14px 46px' }} />
      </div>

      {/* API Results */}
      {apiResults && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>
            Songs for your <span className="gradient-text">{apiResults.mood}</span> mood
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }} className="stagger">
            {apiResults.tracks.map(s => <SongCard key={s.id} song={s} />)}
          </div>
        </div>
      )}

      {/* Local search results */}
      {query && filtered.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14 }}>Search Results</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
            {filtered.map(s => <SongCard key={s.id} song={s} />)}
          </div>
        </div>
      )}

      {/* Genres */}
      {!query && !apiResults && (
        <>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Browse Genres</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14, marginBottom: 32 }} className="stagger">
            {mockGenres.map(g => (
              <button key={g.id} onClick={() => setMoodInput(g.name)} style={{
                height: 80, borderRadius: 14, border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, ${g.bg}, ${g.color}22)`,
                border: `1px solid ${g.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1rem',
                color: g.color, transition: 'all 0.25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${g.color}44`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >{g.name}</button>
            ))}
          </div>

          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>🔥 Trending</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }} className="stagger">
            {mockSongs.slice(0, 6).map(s => <SongCard key={s.id} song={s} />)}
          </div>
        </>
      )}
    </div>
  );
}
