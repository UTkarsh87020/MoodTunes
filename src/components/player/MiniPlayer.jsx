import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX, Heart, Menu } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';

function fmt(s) {
  if (!s && s !== 0) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function MiniPlayer({ onMenuClick }) {
  const {
    currentSong, isPlaying, togglePlay, playNext, playPrev,
    progress, duration, seekTo, volume, isMuted, handleVolumeChange, toggleMute,
    shuffle, setShuffle, repeat, setRepeat, likedSongs, toggleLike
  } = usePlayer();

  const pct = duration ? (progress / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seekTo((e.clientX - rect.left) / rect.width);
  };

  const cycleRepeat = () => setRepeat(r => r === 'off' ? 'all' : r === 'all' ? 'one' : 'off');

  return (
    <div className="mini-player">
      <button className="btn-icon" onClick={onMenuClick} style={{ display: 'none' }} id="sidebar-toggle"><Menu size={20} /></button>

      {currentSong ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <img className="mini-player-art" src={currentSong.coverUrl} alt={currentSong.title} />
          <div className="mini-player-info">
            <div className="mini-player-title">{currentSong.title}</div>
            <div className="mini-player-artist">{currentSong.artist}</div>
          </div>
          <button
            className="btn-icon"
            onClick={() => toggleLike(currentSong.id)}
            style={{ color: likedSongs.has(currentSong.id) ? '#ff006e' : undefined }}
          >
            <Heart size={16} fill={likedSongs.has(currentSong.id) ? '#ff006e' : 'none'} />
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, color: 'var(--text3)', fontSize: '0.85rem' }}>No song playing</div>
      )}

      <div className="mini-player-controls">
        <div className="controls-row">
          <button className={`btn-icon${shuffle ? ' active' : ''}`} onClick={() => setShuffle(s => !s)}><Shuffle size={16} /></button>
          <button className="btn-icon" onClick={playPrev}><SkipBack size={18} /></button>
          <button className="btn-icon xl" onClick={togglePlay}
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: '#fff' }}>
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button className="btn-icon" onClick={playNext}><SkipForward size={18} /></button>
          <button className={`btn-icon${repeat !== 'off' ? ' active' : ''}`} onClick={cycleRepeat}>
            {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>
        <div className="progress-bar-wrap">
          <span className="progress-time">{fmt(progress)}</span>
          <div className="progress-bar" onClick={handleSeek}>
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-time">{fmt(duration)}</span>
        </div>
      </div>

      <div className="mini-player-right">
        <div className="volume-wrap">
          <button className="btn-icon" onClick={toggleMute}>
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume}
            className="volume-slider"
            onChange={e => handleVolumeChange(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
