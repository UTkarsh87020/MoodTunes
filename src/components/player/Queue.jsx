import React, { useState, useRef } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import { GripVertical, X, Music } from 'lucide-react';

export default function Queue() {
  const { queue, currentSong, playSong, setQueue } = usePlayer();
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  const handleDragStart = (i) => { dragItem.current = i; };
  const handleDragEnter = (i) => { dragOver.current = i; };
  const handleDrop = () => {
    const newQ = [...queue];
    const [moved] = newQ.splice(dragItem.current, 1);
    newQ.splice(dragOver.current, 0, moved);
    setQueue(newQ);
    dragItem.current = null; dragOver.current = null;
  };

  return (
    <div style={{ background: 'var(--bg2)', borderLeft: '1px solid var(--border)', width: 280, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '20px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Queue</h3>
        <span className="badge">{queue.length}</span>
      </div>

      {queue.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', gap: 12 }}>
          <Music size={32} />
          <span style={{ fontSize: '0.85rem' }}>Queue is empty</span>
        </div>
      ) : (
        <div style={{ overflow: 'y auto', flex: 1, padding: '0 8px 16px' }}>
          {queue.map((song, i) => (
            <div
              key={song.id + i}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => playSong(song, queue)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px',
                borderRadius: 10, cursor: 'pointer', transition: 'background 0.2s',
                background: currentSong?.id === song.id ? 'rgba(var(--primary-rgb),0.1)' : 'transparent',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--card)'}
              onMouseLeave={e => e.currentTarget.style.background = currentSong?.id === song.id ? 'rgba(var(--primary-rgb),0.1)' : 'transparent'}
            >
              <GripVertical size={14} style={{ color: 'var(--text3)', cursor: 'grab', flexShrink: 0 }} />
              <img src={song.coverUrl} alt={song.title} style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: currentSong?.id === song.id ? 'var(--primary)' : 'var(--text)' }}>{song.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{song.artist}</div>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text3)', flexShrink: 0 }}>{song.duration}</span>
            </div>
          ))}
        </div>
      )}

      {queue.length > 0 && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-ghost" onClick={() => setQueue([])} style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}>
            <X size={14} /> Clear Queue
          </button>
        </div>
      )}
    </div>
  );
}
