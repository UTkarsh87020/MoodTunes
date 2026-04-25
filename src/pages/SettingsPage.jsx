import React from 'react';
import { useTheme, themes } from '../contexts/ThemeContext';
import { Volume2, Bell, Globe, User, Shield, Sliders } from 'lucide-react';

function Section({ icon, title, children }) {
  return (
    <div className="glass" style={{ padding: '24px', marginBottom: 16, borderRadius: 18 }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1rem', fontWeight: 700, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: 2 }}>{desc}</div>}
      </div>
      <button onClick={() => onChange(!checked)} style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: checked ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--bg3)',
        position: 'relative', transition: 'background 0.3s', flexShrink: 0,
      }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: checked ? 23 : 3, transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
      </button>
    </div>
  );
}

const THEME_COLORS = { dark: ['#0a0a0f', '#00d4ff', '#ff006e'], light: ['#f0f2f8', '#0066ff', '#ff6b6b'], neon: ['#000000', '#39ff14', '#00ffff'] };

export default function SettingsPage() {
  const { theme, setTheme, themes } = useTheme();
  const [notifications, setNotifications] = React.useState({ newRelease: true, recommendations: true, social: false });
  const [audio, setAudio] = React.useState({ highQuality: true, crossfade: false, gapless: true, normalize: false });
  const [lang, setLang] = React.useState('en');

  return (
    <div className="page" style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 6 }}>Settings</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 28 }}>Customize your MoodTunes experience</p>

      <Section icon={<span>🎨</span>} title="Appearance">
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 16 }}>Choose your theme</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {Object.entries(themes).map(([key, { label, icon }]) => {
            const [bg, p, a] = THEME_COLORS[key];
            return (
              <button key={key} onClick={() => setTheme(key)} style={{
                border: `2px solid ${theme === key ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 16, padding: 0, cursor: 'pointer', overflow: 'hidden',
                boxShadow: theme === key ? 'var(--glow)' : 'none', background: 'none', transition: 'all 0.25s',
              }}>
                <div style={{ background: bg, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: p }} />
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: a }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ height: 6, borderRadius: 3, background: p, width: '80%' }} />
                    <div style={{ height: 4, borderRadius: 2, background: a + '88', width: '60%' }} />
                    <div style={{ height: 4, borderRadius: 2, background: p + '44', width: '70%' }} />
                  </div>
                </div>
                <div style={{ padding: '8px 12px', background: 'var(--bg2)', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: theme === key ? 'var(--primary)' : 'var(--text)' }}>{icon} {label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section icon={<Volume2 size={18} />} title="Audio">
        {[
          { key: 'highQuality', label: 'High Quality Streaming', desc: 'Stream at 320kbps (uses more data)' },
          { key: 'crossfade', label: 'Crossfade', desc: 'Smoothly blend between tracks' },
          { key: 'gapless', label: 'Gapless Playback', desc: 'No silence between tracks' },
          { key: 'normalize', label: 'Volume Normalization', desc: 'Keep volume consistent across songs' },
        ].map(({ key, label, desc }) => (
          <Toggle key={key} label={label} desc={desc} checked={audio[key]} onChange={v => setAudio(a => ({ ...a, [key]: v }))} />
        ))}
      </Section>

      <Section icon={<Bell size={18} />} title="Notifications">
        {[
          { key: 'newRelease', label: 'New Releases', desc: 'Artists you follow release new music' },
          { key: 'recommendations', label: 'Weekly Recommendations', desc: 'Get your personalized playlist every week' },
          { key: 'social', label: 'Social Activity', desc: 'When friends like or share songs' },
        ].map(({ key, label, desc }) => (
          <Toggle key={key} label={label} desc={desc} checked={notifications[key]} onChange={v => setNotifications(n => ({ ...n, [key]: v }))} />
        ))}
      </Section>

      <Section icon={<Globe size={18} />} title="Language">
        <select className="input" value={lang} onChange={e => setLang(e.target.value)} style={{ maxWidth: 240 }}>
          <option value="en">🇺🇸 English</option>
          <option value="hi">🇮🇳 Hindi</option>
          <option value="es">🇪🇸 Español</option>
        </select>
      </Section>

      <Section icon={<User size={18} />} title="Account">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}><Shield size={14} /> Change Password</button>
          <button className="btn btn-secondary" style={{ alignSelf: 'flex-start', color: '#ef4444', borderColor: '#ef4444' }}>Delete Account</button>
        </div>
      </Section>
    </div>
  );
}
