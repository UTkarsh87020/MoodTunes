import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, User, Settings, Info, Shield, Heart, ListMusic, PlusCircle, Clock, LogOut, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { mockPlaylists } from '../../data/mockData';

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { playSong, likedSongs } = usePlayer();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {open && <div className="modal-bg" style={{ zIndex: 99 }} onClick={onClose} />}
      <aside className={`sidebar${open ? ' open' : ''}`} style={{ zIndex: 100 }}>
        <div className="sidebar-logo">
          <NavLink to="/" className="gradient-text">🎵 MoodTunes</NavLink>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} onClick={onClose} end>
            <Home size={18} /> Home
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} onClick={onClose}>
            <Search size={18} /> Search
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} onClick={onClose}>
            <User size={18} /> Profile
          </NavLink>
        </nav>

        <div className="sidebar-section">Your Library</div>
        <nav className="sidebar-nav">
          <button className="nav-item"><Heart size={18} /> Liked Songs <span className="badge" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>{likedSongs.size}</span></button>
          <button className="nav-item"><Clock size={18} /> Recently Played</button>
          <button className="nav-item"><PlusCircle size={18} /> Create Playlist</button>
        </nav>

        <div className="sidebar-section">Playlists</div>
        <nav className="sidebar-nav">
          {mockPlaylists.map(pl => (
            <button key={pl.id} className="nav-item" style={{ gap: 10 }}>
              <img src={pl.coverUrl} alt={pl.name} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-section" style={{ marginTop: 'auto' }}>More</div>
        <nav className="sidebar-nav">
          <NavLink to="/settings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} onClick={onClose}>
            <Settings size={18} /> Settings
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} onClick={onClose}>
            <Info size={18} /> About
          </NavLink>
          <NavLink to="/privacy" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} onClick={onClose}>
            <Shield size={18} /> Privacy
          </NavLink>
        </nav>

        {user && (
          <div className="sidebar-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={user.avatarUrl} alt={user.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>@{user.username}</div>
              </div>
              <button className="btn-icon" onClick={handleLogout} title="Logout"><LogOut size={16} /></button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
