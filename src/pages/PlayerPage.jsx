import React, { useState, useEffect } from 'react';
import { Search, Heart, Play, Loader } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { mockSongs, mockPlaylists, mockGenres } from '../data/mockData';
import Queue from '../components/player/Queue';

function TrackRow({ song, index }) {
  const { playSong, currentSong, isPlaying, likedSongs, toggleLike } = usePlayer();
  const active = currentSong?.id === song.id;
  return (
    <div
      onClick={() => playSong(song, mockSongs)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px',
        borderRadius: 10, cursor: 'pointer', transition: 'background 0.2s',
        background: active ? 'rgba(var(--primary-rgb),0.1)' : 'transparent',
      }}
      onMouseEnter={e => e.currentTarget.style.background = active ? 'rgba(var(--primary-rgb),0.15)' : 'var(--card)'}
      onMouseLeave={e => e.currentTarget.style.background = active ? 'rgba(var(--primary-rgb),0.1)' : 'transparent'}
    >
      <span style={{ width: 20, textAlign: 'center', fontSize: '0.8rem', color: active ? 'var(--primary)' : 'var(--text3)' }}>
        {active && isPlaying ? <span className="visualizer" style={{ height: 16 }}><span className="vis-bar" style={{ height: '100%' }} /><span className="vis-bar" /><span className="vis-bar" /></span> : index + 1}
      </span>
      <img src={song.coverUrl} alt={song.title} style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: active ? 'var(--primary)' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{song.artist}</div>
      </div>
      <span style={{ fontSize: '0.8rem', color: 'var(--text2)', display: 'none' }}>{song.album}</span>
      <button className="btn-icon" onClick={e => { e.stopPropagation(); toggleLike(song.id); }} style={{ color: likedSongs.has(song.id) ? '#ff006e' : undefined }}>
        <Heart size={15} fill={likedSongs.has(song.id) ? '#ff006e' : 'none'} />
      </button>
      <span style={{ fontSize: '0.8rem', color: 'var(--text3)', minWidth: 36, textAlign: 'right' }}>{song.duration}</span>
    </div>
  );
}

export default function PlayerPage() {
  const { currentSong, playSong, setQueue } = usePlayer();
  const [search, setSearch] = useState('');
  const [moodText, setMoodText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activePlaylist, setActivePlaylist] = useState(null);

  const filtered = mockSongs.filter(s =>
    !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.artist.toLowerCase().includes(search.toLowerCase())
  );

  const analyzeMood = async () => {
    if (!moodText.trim()) return;
    setLoading(true);
    setResults(null);
    try {
      const r1 = await fetch('/api/analyze-mood', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: moodText }) });
      const mood = await r1.json();
      const r2 = await fetch('/api/get-recommendations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ genres: mood.genres, mood: mood.mood }) });
      const recs = await r2.json();
      const tracks = (recs.tracks || []).map(t => ({ ...t, title: t.name, coverUrl: t.albumArt || `https://placehold.co/300x300/001020/00d4ff?text=${encodeURIComponent(t.name?.slice(0,2)||'🎵')}` }));
      setResults({ mood: mood.mood, tracks });
      if (tracks.length) { setQueue(tracks); playSong(tracks[0], tracks); }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const songs = results?.tracks?.length ? results.tracks : filtered;

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Main area */}
      <div style={{ flex: 1, overflow: 'y auto', padding: '24px 28px' }}>
        {/* Hero mood input */}
        <div className="glass" style={{ padding: '28px', marginBottom: 28, background: 'linear-gradient(135deg, rgba(var(--primary-rgb),0.08), rgba(var(--accent-rgb),0.08))' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: 6 }}>How are you feeling? <span className="gradient-text">🎵</span></h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.88rem', marginBottom: 16 }}>Describe your mood and we'll find the perfect tracks</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              className="input" placeholder="e.g. I feel energetic and happy today..."
              value={moodText} onChange={e => setMoodText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyzeMood()}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={analyzeMood} disabled={loading}>
              {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : '🎵'} Analyze
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {['Happy & Energetic', 'Calm & Peaceful', 'Sad & Melancholic', 'Intense & Powerful'].map(m => (
              <button key={m} className="btn btn-ghost" onClick={() => setMoodText(m)} style={{ fontSize: '0.8rem', padding: '5px 12px', border: '1px solid var(--border)' }}>{m}</button>
            ))}
          </div>
        </div>

        {results && (
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>Mood: <span className="gradient-text">{results.mood}</span></h3>
            <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{results.tracks.length} tracks found</p>
          </div>
        )}

        {/* Playlists */}
        {!results && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>Your Playlists</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {mockPlaylists.map(pl => (
                <div key={pl.id} onClick={() => setActivePlaylist(activePlaylist?.id === pl.id ? null : pl)} className="track-card" style={{ cursor: 'pointer' }}>
                  <img src={pl.coverUrl} alt={pl.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                  <div className="track-card-body"><div className="track-card-title">{pl.name}</div><div className="track-card-artist">{pl.songs.length} songs</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search + Song List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{results ? 'Recommended Tracks' : 'All Songs'}</h3>
            {!results && (
              <div className="input-wrap" style={{ width: 220 }}>
                <Search size={15} className="icon" />
                <input className="input has-icon" placeholder="Search songs..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px 12px 8px 38px', fontSize: '0.85rem' }} />
              </div>
            )}
          </div>
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {songs.map((s, i) => <TrackRow key={s.id} song={s} index={i} />)}
          </div>
        </div>
      </div>

      {/* Queue panel */}
      <Queue />
    </div>
  );
}
