import React, { useState, useEffect, useRef } from 'react';
import { mockTeam } from '../data/mockData';
import { Headphones, Zap, Globe, Cpu, BarChart2, Lock } from 'lucide-react';

const FEATURES = [
  { icon: <Headphones size={28} />, title: 'Unlimited Playlists', desc: 'Create as many playlists as you want, curated perfectly for every mood and moment.' },
  { icon: <Zap size={28} />, title: 'High-Quality Audio', desc: 'Experience music at up to 320kbps with crystal-clear sound and deep bass.' },
  { icon: <Globe size={28} />, title: 'Cross-Platform Sync', desc: 'Your playlists and preferences follow you across all your devices, instantly.' },
  { icon: <Cpu size={28} />, title: 'AI Recommendations', desc: 'Our AI analyzes your mood and finds the perfect tracks for how you feel right now.' },
  { icon: <BarChart2 size={28} />, title: 'Listening Stats', desc: 'Deep insights into your listening habits, top artists, and music journey.' },
  { icon: <Lock size={28} />, title: 'Privacy First', desc: 'Your data stays yours. We never sell your listening history to advertisers.' },
];

const STATS = [{ label: 'Active Users', end: 2400000, suffix: '+' }, { label: 'Songs Available', end: 80000000, suffix: '+' }, { label: 'Playlists Created', end: 15000000, suffix: '+' }];

function AnimatedCounter({ end, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 2000, steps = 60, step = end / steps;
        let cur = 0;
        const interval = setInterval(() => { cur += step; if (cur >= end) { setCount(end); clearInterval(interval); } else setCount(Math.floor(cur)); }, dur / steps);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(0) + 'K' : n;
  return <span ref={ref} style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif' }} className="gradient-text">{fmt(count)}{suffix}</span>;
}

export default function AboutPage() {
  return (
    <div className="page" style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '40px 20px 60px', position: 'relative' }}>
        <div className="orb" style={{ width: 400, height: 400, background: 'var(--primary)', top: -100, left: '50%', transform: 'translateX(-50%)', position: 'absolute', opacity: 0.07 }} />
        <div style={{ fontSize: '4rem', marginBottom: 16, animation: 'pulse 3s ease-in-out infinite' }}>🎵</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, marginBottom: 16 }}>
          Music meets <span className="gradient-text">Intelligence</span>
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 32px' }}>
          MoodTunes uses AI to understand how you feel and deliver music that perfectly matches your emotional state — every single time.
        </p>
        <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>🚀 Start Listening</button>
      </div>

      {/* Features */}
      <div style={{ marginBottom: 64 }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: 40 }}>Everything you need</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }} className="stagger">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="glass" style={{ padding: '28px 24px', borderRadius: 20, transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--glow)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ color: 'var(--primary)', marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="glass" style={{ padding: '48px', borderRadius: 24, textAlign: 'center', marginBottom: 64, background: 'linear-gradient(135deg, rgba(var(--primary-rgb),0.06), rgba(var(--accent-rgb),0.06))' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 20 }}>Our Mission</h2>
        <p style={{ color: 'var(--text2)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 640, margin: '0 auto' }}>
          We believe music is the universal language of emotion. Our mission is to bridge the gap between how you feel and what you hear — creating a deeply personal listening experience that evolves with you.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 64 }}>
        {STATS.map(s => (
          <div key={s.label} className="glass" style={{ padding: '32px 20px', textAlign: 'center', borderRadius: 20 }}>
            <AnimatedCounter end={s.end} suffix={s.suffix} />
            <div style={{ color: 'var(--text2)', marginTop: 8, fontSize: '0.9rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Team */}
      <div>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: 32 }}>Meet the Team</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }} className="stagger">
          {mockTeam.map(m => (
            <div key={m.name} className="glass" style={{ padding: '24px', textAlign: 'center', borderRadius: 20 }}>
              <img src={m.avatar} alt={m.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', marginBottom: 12 }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{m.name}</div>
              <div style={{ color: 'var(--primary)', fontSize: '0.8rem', marginTop: 4 }}>{m.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
