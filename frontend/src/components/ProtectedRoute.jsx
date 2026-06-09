import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';

export default function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  // While we check if the refresh token restores a session, show nothing
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)' }}>
          侘
        </p>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
