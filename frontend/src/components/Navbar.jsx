import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/AppContext';

export default function Navbar({ dark = false }) {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isCustomer = !location.pathname.startsWith('/admin');
  const links = isCustomer
    ? [
        { label: 'Menu', path: '/menu' },
        { label: 'Checkout', path: '/checkout' },
      ]
    : [
        { label: 'Tables', path: '/admin/tables' },
        { label: 'Orders', path: '/admin/orders' },
        { label: 'Menu', path: '/admin/menu' },
      ];

  const bg = dark || scrolled ? 'var(--ink)' : 'transparent';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
      background: bg,
      borderBottom: (dark || scrolled) ? '1px solid rgba(184,146,42,0.2)' : 'none',
      transition: 'background 0.4s ease, border-color 0.4s ease',
      padding: '0 2rem',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <button
          onClick={() => navigate(isCustomer ? '/' : '/admin')}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 500,
            color: 'var(--gold)',
            letterSpacing: '0.06em',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          侘 Shabuyaki
        </button>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          {links.map(l => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: location.pathname === l.path ? 'var(--gold)' : 'rgba(245,240,232,0.75)',
                background: 'none', border: 'none', cursor: 'pointer',
                transition: 'color 0.2s',
                borderBottom: location.pathname === l.path ? '1px solid var(--gold)' : 'none',
                paddingBottom: 2,
              }}
            >
              {l.label}
            </button>
          ))}

          {isCustomer && (
            <button
              onClick={() => navigate('/checkout')}
              style={{
                position: 'relative',
                color: 'var(--gold)',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: -8, right: -8,
                  background: 'var(--red-lacquer)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                  borderRadius: '50%',
                  width: 18, height: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {itemCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileOpen(o => !o)}
          style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: 'var(--ink)',
          borderTop: '1px solid rgba(184,146,42,0.2)',
          padding: '1rem 2rem 1.5rem',
        }}>
          {links.map(l => (
            <button
              key={l.path}
              onClick={() => { navigate(l.path); setMobileOpen(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: location.pathname === l.path ? 'var(--gold)' : 'var(--washi)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(245,240,232,0.08)',
              }}
            >
              {l.label}
            </button>
          ))}
          {isCustomer && (
            <button
              onClick={() => { navigate('/checkout'); setMobileOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginTop: '1rem',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <ShoppingBag size={18} />
              Cart ({itemCount})
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
