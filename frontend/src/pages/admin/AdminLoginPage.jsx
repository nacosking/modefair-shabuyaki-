import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../../context/AppContext';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin/tables');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'rgba(245,240,232,0.05)', border: '1px solid rgba(245,240,232,0.15)',
    borderRadius: 2, color: 'var(--washi)', fontFamily: 'var(--font-ui)', fontSize: '0.9rem',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 30% 40%, rgba(184,146,42,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 400 }} className="page-enter">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 56, height: 56, border: '1px solid rgba(184,146,42,0.35)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)' }}>侘</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--washi)', marginBottom: '0.25rem' }}>Shabuyaki</h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--stone-light)' }}>Staff Portal</p>
        </div>

        <div style={{ background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(245,240,232,0.1)', borderRadius: 4, padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
            <Lock size={14} color="var(--gold)" />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>Secure Admin Login</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone-light)', marginBottom: '0.5rem' }}>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" autoComplete="username" required style={inputStyle}
                onFocus={e => e.target.style.borderColor='rgba(184,146,42,0.5)'}
                onBlur={e => e.target.style.borderColor='rgba(245,240,232,0.15)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone-light)', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" required style={{ ...inputStyle, paddingRight: '2.8rem' }}
                  onFocus={e => e.target.style.borderColor='rgba(184,146,42,0.5)'}
                  onBlur={e => e.target.style.borderColor='rgba(245,240,232,0.15)'}
                />
                <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-light)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.6rem 0.9rem', background: 'rgba(139,26,26,0.15)', border: '1px solid rgba(139,26,26,0.3)', borderRadius: 2 }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#e07070' }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.85rem', background: loading ? 'var(--gold-muted)' : 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', borderRadius: 2, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.25rem' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={() => navigate('/')} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--stone-light)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color='var(--gold)'}
            onMouseLeave={e => e.target.style.color='var(--stone-light)'}
          >
            ← Back to restaurant
          </button>
        </div>
      </div>
    </div>
  );
}
