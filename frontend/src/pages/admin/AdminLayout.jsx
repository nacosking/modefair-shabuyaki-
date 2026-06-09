import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutGrid, ClipboardList, BookOpen, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AppContext';

const navItems = [
  { path: '/admin/tables', label: 'Table Map', labelJP: 'テーブル', icon: LayoutGrid },
  { path: '/admin/orders', label: 'Orders',    labelJP: '注文',     icon: ClipboardList },
  { path: '/admin/menu',   label: 'Menu',      labelJP: 'メニュー', icon: BookOpen },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{
        padding: '1.75rem 1.5rem',
        borderBottom: '1px solid rgba(184,146,42,0.15)',
        marginBottom: '0.5rem',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          color: 'var(--gold)',
          marginBottom: '0.1rem',
        }}>侘 Shabuyaki</p>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.6rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--stone-light)',
        }}>Admin Portal</p>
      </div>

      {/* User badge */}
      <div style={{ padding: '0.75rem 1.5rem', marginBottom: '0.5rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0.6rem 0.8rem',
          background: 'rgba(184,146,42,0.08)',
          borderRadius: 3,
          border: '1px solid rgba(184,146,42,0.15)',
        }}>
          <div style={{
            width: 28, height: 28,
            borderRadius: '50%',
            background: 'var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink)' }}>
              {admin?.username?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--washi)', fontWeight: 500 }}>
              {admin?.username}
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: 'var(--stone-light)', letterSpacing: '0.08em' }}>
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 1rem' }}>
        {navItems.map(({ path, label, labelJP, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => { navigate(path); setMobileOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%',
                padding: '0.75rem 0.9rem',
                marginBottom: '0.2rem',
                background: active ? 'rgba(184,146,42,0.12)' : 'transparent',
                border: active ? '1px solid rgba(184,146,42,0.2)' : '1px solid transparent',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(245,240,232,0.04)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={16} color={active ? 'var(--gold)' : 'var(--stone-light)'} />
              <div style={{ textAlign: 'left' }}>
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.8rem',
                  color: active ? 'var(--gold)' : 'var(--washi)',
                  fontWeight: active ? 500 : 400,
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.65rem',
                  fontStyle: 'italic',
                  color: 'var(--stone-light)',
                }}>
                  {labelJP}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(245,240,232,0.08)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%',
            padding: '0.65rem 0.9rem',
            background: 'transparent',
            border: '1px solid rgba(245,240,232,0.08)',
            borderRadius: 3,
            cursor: 'pointer',
            color: 'var(--stone-light)',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#e07070'; e.currentTarget.style.borderColor = 'rgba(139,26,26,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--stone-light)'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)'; }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--washi)' }}>
      {/* Desktop sidebar */}
      <aside style={{
        width: 220,
        background: 'var(--ink)',
        flexShrink: 0,
        borderRight: '1px solid rgba(184,146,42,0.12)',
        position: 'fixed', top: 0, bottom: 0, left: 0,
        zIndex: 200,
        overflowY: 'auto',
      }}
      className="admin-sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div
        className="admin-mobile-bar"
        style={{
          display: 'none',
          position: 'fixed', top: 0, left: 0, right: 0,
          height: 56,
          background: 'var(--ink)',
          borderBottom: '1px solid rgba(184,146,42,0.15)',
          zIndex: 200,
          padding: '0 1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold)' }}>侘 Shabuyaki</span>
        <button onClick={() => setMobileOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)' }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          display: 'flex',
        }}>
          <div style={{
            width: 240,
            background: 'var(--ink)',
            height: '100%',
            overflowY: 'auto',
            borderRight: '1px solid rgba(184,146,42,0.15)',
          }}>
            <SidebarContent />
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)' }} onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: 220,
        padding: '2rem',
        minHeight: '100vh',
      }}
      className="admin-main"
      >
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-mobile-bar { display: flex !important; }
          .admin-main { margin-left: 0 !important; padding-top: 4.5rem !important; }
        }
      `}</style>
    </div>
  );
}
