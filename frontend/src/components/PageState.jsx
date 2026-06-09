import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: '1rem' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '2px solid var(--washi-dark)',
        borderTopColor: 'var(--gold)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--stone-light)', letterSpacing: '0.08em' }}>{label}</p>
      <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

export function PageError({ message, onRetry }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: '1rem', textAlign: 'center', padding: '2rem' }}>
      <AlertCircle size={32} color="var(--red-lacquer)" />
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--stone)', maxWidth: 340 }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.55rem 1.25rem', background: 'var(--ink)', color: 'var(--washi)', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: 2, cursor: 'pointer' }}
        >
          <RefreshCw size={13} /> Retry
        </button>
      )}
    </div>
  );
}
