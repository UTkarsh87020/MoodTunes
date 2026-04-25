import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AtSign, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const STEPS = ['Account', 'Profile', 'Finish'];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '', confirm: '', terms: false });
  const [showPw, setShowPw] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const checkUsername = (val) => {
    set('username', val);
    if (val.length < 3) { setUsernameStatus(null); return; }
    setTimeout(() => setUsernameStatus(val !== 'taken' ? 'available' : 'taken'), 600);
  };

  const next = () => {
    setError('');
    if (step === 0) {
      if (!form.name || !form.email) { setError('Fill in name and email.'); return; }
    } else if (step === 1) {
      if (!form.username || !form.password) { setError('Fill in all fields.'); return; }
      if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!form.terms) { setError('Please accept the terms.'); return; }
    await register(form);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div className="orb orb-1" /><div className="orb orb-2" />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460, padding: '0 20px', animation: 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1)' }}>
        <div className="glass-strong" style={{ padding: '40px 36px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: 4 }}>Create Account</h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>Join MoodTunes today</p>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.3s',
                    background: i < step ? 'linear-gradient(135deg, var(--primary), var(--accent))' : i === step ? 'rgba(var(--primary-rgb),0.2)' : 'var(--bg3)',
                    color: i <= step ? 'var(--primary)' : 'var(--text3)',
                    border: `2px solid ${i <= step ? 'var(--primary)' : 'var(--border)'}`,
                    boxShadow: i === step ? 'var(--glow)' : 'none'
                  }}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: i === step ? 'var(--primary)' : 'var(--text3)', fontWeight: 600 }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, margin: '0 8px', marginBottom: 18, background: i < step ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 200 }}>
            {step === 0 && (
              <>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <div className="input-wrap"><User size={16} className="icon" />
                    <input className="input has-icon" placeholder="Alex Rivera" value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <div className="input-wrap"><Mail size={16} className="icon" />
                    <input className="input has-icon" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="input-group">
                  <label className="input-label">Username</label>
                  <div className="input-wrap" style={{ position: 'relative' }}>
                    <AtSign size={16} className="icon" />
                    <input className="input has-icon" placeholder="cooluser" value={form.username} onChange={e => checkUsername(e.target.value)} style={{ paddingRight: 36 }} />
                    {usernameStatus && (
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: usernameStatus === 'available' ? '#22c55e' : '#ef4444' }}>
                        {usernameStatus === 'available' ? '✓ Available' : '✗ Taken'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Password</label>
                  <div className="input-wrap" style={{ position: 'relative' }}>
                    <Lock size={16} className="icon" />
                    <input className="input has-icon" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} style={{ paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Confirm Password</label>
                  <div className="input-wrap"><Lock size={16} className="icon" />
                    <input className="input has-icon" type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
                <div style={{ fontSize: '3rem' }}>🎉</div>
                <h2 style={{ fontSize: '1.3rem' }}>Almost there, <span className="gradient-text">{form.name.split(' ')[0]}</span>!</h2>
                <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Your account is ready to be created.</p>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text2)' }}>
                  <input type="checkbox" checked={form.terms} onChange={e => set('terms', e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                  I agree to the <Link to="/privacy" style={{ color: 'var(--primary)' }}>Terms & Privacy</Link>
                </label>
              </div>
            )}
          </div>

          {error && <div className="input-error" style={{ textAlign: 'center', marginTop: 8 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {step > 0 && (
              <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)} style={{ flex: 1, justifyContent: 'center' }}>
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < 2 ? (
              <button className="btn btn-primary" onClick={next} style={{ flex: 1, justifyContent: 'center' }}>
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={isLoading} style={{ flex: 1, justifyContent: 'center' }}>
                {isLoading ? '⏳ Creating...' : '🚀 Create Account'}
              </button>
            )}
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text2)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
