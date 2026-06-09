import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../../data/menuData';

/* ── Decorative kanji strip ────────────────────────────────────────── */
const kanji = ['和', '食', '雅', '侘', '寂', '趣', '粋', '品', '雅', '旨'];

export default function WelcomePage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  /* Subtle parallax on scroll */
  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', color: 'var(--washi)' }}>

      {/* ── Admin link (top-right corner, subtle) ── */}
      <div style={{
        position: 'fixed', top: 20, right: 24, zIndex: 600,
      }}>
        <button
          onClick={() => navigate('/admin/login')}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(184,146,42,0.5)',
            background: 'none', border: 'none', cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--gold)'}
          onMouseLeave={e => e.target.style.color = 'rgba(184,146,42,0.5)'}
        >
          Staff Access
        </button>
      </div>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '0 1.5rem',
      }}>
        {/* Background texture / gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(184,146,42,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 80% at 20% 60%, rgba(139,26,26,0.06) 0%, transparent 60%)
          `,
        }} />

        {/* Vertical kanji strip — left */}
        <div ref={heroRef} style={{
          position: 'absolute', left: 32, top: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: '1.5rem',
          opacity: 0.08,
        }}>
          {kanji.map((k, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              color: 'var(--gold)',
              writingMode: 'vertical-rl',
            }}>{k}</span>
          ))}
        </div>

        {/* Vertical kanji strip — right */}
        <div style={{
          position: 'absolute', right: 32, top: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: '1.5rem',
          opacity: 0.06,
        }}>
          {[...kanji].reverse().map((k, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              color: 'var(--gold)',
              writingMode: 'vertical-rl',
            }}>{k}</span>
          ))}
        </div>

        {/* Centre content */}
        <div style={{
          position: 'relative',
          textAlign: 'center',
          maxWidth: 640,
        }} className="page-enter">

          {/* Mon crest */}
          <div style={{
            width: 60, height: 60,
            border: '1px solid rgba(184,146,42,0.4)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem',
          }}>
            <span style={{ fontSize: '1.6rem', color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>侘</span>
          </div>

          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '1.2rem',
          }}>
            Fine Japanese Dining
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            fontWeight: 300,
            lineHeight: 1,
            color: 'var(--washi)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}>
            Shabuyaki
          </h1>

          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: 'rgba(245,240,232,0.45)',
            marginBottom: '3rem',
            letterSpacing: '0.05em',
          }}>
            {RESTAURANT_INFO.tagline}
          </p>

          {/* Horizontal rule */}
          <div style={{
            width: 80, height: 1,
            background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
            margin: '0 auto 3rem',
          }} />

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            lineHeight: 1.8,
            color: 'rgba(245,240,232,0.6)',
            marginBottom: '3rem',
            fontWeight: 300,
          }}>
            Where binchōtan charcoal meets pristine ocean, where centuries of Japanese craft are
            expressed in every quiet, deliberate dish.
          </p>

          <button
            onClick={() => navigate('/menu')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              padding: '1rem 2.5rem',
              background: 'var(--gold)',
              color: 'var(--ink)',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'background 0.25s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            View Our Menu
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <section style={{
        background: 'var(--ink-soft)',
        borderTop: '1px solid rgba(184,146,42,0.15)',
        borderBottom: '1px solid rgba(184,146,42,0.15)',
        padding: '4rem 1.5rem',
      }}>
        <div style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          textAlign: 'center',
        }}>
          {[
            { jp: '素材', en: 'Provenance', body: 'Ingredients sourced daily from Tsukiji, Hokkaido, and local highland farms.' },
            { jp: '技', en: 'Craft',       body: 'Our chefs train in Japan for a minimum of three years before joining Shabuyaki.' },
            { jp: '間', en: 'Ma',          body: 'Every dish is an exercise in negative space — what is withheld is as important as what is offered.' },
          ].map(({ jp, en, body }) => (
            <div key={en}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                color: 'var(--gold)',
                marginBottom: '0.5rem',
              }}>{jp}</div>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.65rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--stone-light)',
                marginBottom: '1rem',
              }}>{en}</div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                lineHeight: 1.8,
                color: 'rgba(245,240,232,0.5)',
                fontWeight: 300,
              }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER INFO ── */}
      <footer style={{
        padding: '3rem 1.5rem',
        textAlign: 'center',
        background: 'var(--ink)',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: '1rem' }}>
          侘
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--stone-light)', marginBottom: '0.4rem' }}>
          {RESTAURANT_INFO.address}
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', letterSpacing: '0.08em', color: 'var(--stone-light)', marginBottom: '0.4rem' }}>
          {RESTAURANT_INFO.phone}
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', letterSpacing: '0.08em', color: 'var(--stone-light)' }}>
          {RESTAURANT_INFO.hours}
        </p>
        <div style={{ marginTop: '2rem', height: 1, background: 'rgba(184,146,42,0.1)', maxWidth: 200, margin: '2rem auto 0' }} />
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'rgba(122,114,101,0.6)', marginTop: '1rem', letterSpacing: '0.08em' }}>
          © {new Date().getFullYear()} Shabuyaki. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
