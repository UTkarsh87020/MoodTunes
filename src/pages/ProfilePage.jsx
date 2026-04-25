import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePlayer } from '../contexts/PlayerContext';
import { mockSongs } from '../data/mockData';
import { Camera, Edit3, Check, Lock, Globe } from 'lucide-react';

function StatCard({ label, value, color }) {
  return (
    <div className="glass" style={{ padding: '20px', textAlign: 'center', borderRadius: 16 }}>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: color || 'var(--primary)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { playSong, likedSongs } = usePlayer();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [isPublic, setIsPublic] = useState(true);
  const liked = mockSongs.filter(s => likedSongs.has(s.id));

  const save = () => { updateUser({ bio }); setEditing(false); };

  if (!user) return null;
  return (
    <div className="page" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Banner */}
      <div style={{ height: 160, borderRadius: 20, marginBottom: -60, background: 'linear-gradient(135deg, rgba(var(--primary-rgb),0.3), rgba(var(--accent-rgb),0.3))', position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: 300, height: 300, background: 'var(--primary)', top: -100, right: -50, position: 'absolute', opacity: 0.2 }} />
      </div>

      {/* Avatar + Info */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, padding: '0 24px', marginBottom: 28 }}>
        <div style={{ position: 'relative' }}>
          <img src={user.avatarUrl} alt={user.name} style={{ width: 100, height: 100, borderRadius: '50%', border: '4px solid var(--bg)', objectFit: 'cover', zIndex: 1, position: 'relative' }} />
          <button className="btn-icon" style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, background: 'var(--primary)', color: '#000' }}><Camera size={13} /></button>
        </div>
        <div style={{ flex: 1, paddingBottom: 8 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{user.name}</h1>
          <div style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>@{user.username}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, paddingBottom: 8 }}>
          <button className={`btn btn-secondary`} onClick={() => setIsPublic(p => !p)} style={{ fontSize: '0.82rem' }}>
            {isPublic ? <Globe size={14} /> : <Lock size={14} />}
            {isPublic ? 'Public' : 'Private'}
          </button>
          {editing ? (
            <button className="btn btn-primary" onClick={save}><Check size={14} /> Save</button>
          ) : (
            <button className="btn btn-secondary" onClick={() => setEditing(true)}><Edit3 size={14} /> Edit</button>
          )}
        </div>
      </div>

      {/* Bio */}
      <div style={{ padding: '0 24px', marginBottom: 28 }}>
        {editing ? (
          <textarea className="input" value={bio} onChange={e => setBio(e.target.value)} rows={2} style={{ resize: 'none', width: '100%' }} />
        ) : (
          <p style={{ color: 'var(--text2)' }}>{bio || 'No bio yet.'}</p>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, padding: '0 24px', marginBottom: 32 }}>
        <StatCard label="Hours Listened" value={user.stats.totalHours} color="var(--primary)" />
        <StatCard label="Liked Songs" value={user.stats.songsLiked} color="var(--accent)" />
        <StatCard label="Playlists" value={user.stats.playlists} color="#22c55e" />
        <StatCard label="Top Genre" value={user.stats.topGenre} color="#f59e0b" />
      </div>

      {/* Top Artists */}
      <div style={{ padding: '0 24px', marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14 }}>Top Artists</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {user.topArtists.map((a, i) => (
            <div key={a} className="glass" style={{ padding: '8px 16px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>#{i + 1}</span> {a}
            </div>
          ))}
        </div>
      </div>

      {/* Liked Songs */}
      {liked.length > 0 && (
        <div style={{ padding: '0 24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14 }}>❤️ Liked Songs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
            {liked.map(s => (
              <div key={s.id} className="track-card" onClick={() => playSong(s, liked)}>
                <img src={s.coverUrl} alt={s.title} />
                <div className="track-card-body"><div className="track-card-title">{s.title}</div><div className="track-card-artist">{s.artist}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
