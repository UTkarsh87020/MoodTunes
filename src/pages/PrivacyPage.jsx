import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SECTIONS = [
  { id: 'collect', title: '1. Information We Collect', content: 'We collect information you provide directly (name, email, password), usage data (songs played, playlists created, search queries), and device information (browser type, OS, IP address) to improve our services.' },
  { id: 'use', title: '2. How We Use Your Information', content: 'We use your information to provide and improve MoodTunes, personalize your experience, send you updates (with your consent), analyze usage patterns, and ensure the security of our platform.' },
  { id: 'share', title: '3. Information Sharing', content: 'We do not sell your personal data. We may share anonymized, aggregated data with partners for analytics. We may share data with service providers who help us operate MoodTunes, under strict confidentiality agreements.' },
  { id: 'cookies', title: '4. Cookies & Tracking', content: 'We use essential cookies for authentication and preferences (including your theme choice). We use analytics cookies to understand how MoodTunes is used. You can control cookies through your browser settings.' },
  { id: 'rights', title: '5. Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. You may opt out of marketing communications, request data portability, and withdraw consent for non-essential processing.' },
  { id: 'security', title: '6. Data Security', content: 'We use industry-standard encryption (TLS) for data in transit and AES-256 for data at rest. We regularly audit our security practices and promptly notify users of any data breaches.' },
  { id: 'retention', title: '7. Data Retention', content: 'We retain your account data while your account is active. After account deletion, we delete your data within 30 days, except where required by law to retain it longer.' },
  { id: 'children', title: '8. Children\'s Privacy', content: 'MoodTunes is not intended for users under 13. We do not knowingly collect personal information from children. If you believe a child has provided us data, please contact us immediately.' },
  { id: 'changes', title: '9. Changes to This Policy', content: 'We may update this privacy policy periodically. We will notify you of significant changes via email or an in-app notification. Continued use of MoodTunes after changes constitutes acceptance.' },
  { id: 'contact', title: '10. Contact Us', content: 'For privacy-related questions or to exercise your rights, contact our Data Protection Officer at privacy@moodtunes.app or write to us at MoodTunes Inc., 123 Music Lane, San Francisco, CA 94102.' },
];

function AccordionItem({ section }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass" style={{ marginBottom: 10, borderRadius: 14, overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.95rem', textAlign: 'left',
        transition: 'color 0.2s',
      }}>
        {section.title}
        {open ? <ChevronUp size={18} style={{ color: 'var(--primary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text3)' }} />}
      </button>
      {open && (
        <div style={{ padding: '0 20px 20px', color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.8, animation: 'fadeUp 0.2s' }}>
          {section.content}
        </div>
      )}
    </div>
  );
}

export default function PrivacyPage() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="page" style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
        <div style={{ display: 'flex', gap: 16, color: 'var(--text2)', fontSize: '0.85rem' }}>
          <span>Last updated: April 26, 2026</span>
          <span>•</span>
          <a href="mailto:privacy@moodtunes.app" style={{ color: 'var(--primary)', textDecoration: 'none' }}>privacy@moodtunes.app</a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28, alignItems: 'start' }}>
        {/* TOC */}
        <div className="glass" style={{ padding: '20px', position: 'sticky', top: 20, borderRadius: 16 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Contents</div>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)} style={{
              display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none',
              padding: '7px 10px', borderRadius: 8, fontSize: '0.8rem', color: 'var(--text2)',
              cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'var(--card)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'none'; }}
            >
              {s.title.split('. ')[1] || s.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          <div className="glass" style={{ padding: '20px 24px', marginBottom: 16, borderRadius: 14, borderLeft: '3px solid var(--primary)', background: 'rgba(var(--primary-rgb),0.05)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.7 }}>
              Your privacy matters to us. This policy explains how MoodTunes collects, uses, and protects your personal information when you use our service.
            </p>
          </div>
          {SECTIONS.map(s => (
            <div key={s.id} id={s.id}><AccordionItem section={s} /></div>
          ))}
        </div>
      </div>
    </div>
  );
}
