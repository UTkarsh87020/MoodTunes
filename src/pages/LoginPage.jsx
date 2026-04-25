import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Music } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/'); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    const ok = await login(email, password);
    if (ok) navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'var(--bg)' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, padding: '0 20px', animation: 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1)' }}>
        <div className="glass-strong" style={{ padding: '40px 36px', animation: 'float 6s ease-in-out infinite' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎵</div>
            <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: 6 }}>MoodTunes</h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="input-wrap">
                <Mail size={16} className="icon" />
                <input className="input has-icon" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrap" style={{ position: 'relative' }}>
                <Lock size={16} className="icon" />
                <input className="input has-icon" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <a href="#" style={{ fontSize: '0.82rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</a>
            </div>

            {error && <div className="input-error" style={{ textAlign: 'center' }}>{error}</div>}

            <button className="btn btn-primary" type="submit" disabled={isLoading} style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
              {isLoading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider" style={{ margin: '20px 0' }}>or continue with</div>

          <div style={{ display: 'flex', gap: 12 }}>
            {[['🔵', 'Google'], ['💚', 'Spotify']].map(([icon, name]) => (
              <button key={name} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                {icon} {name}
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: 'var(--text2)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
    </div>
  );
}
