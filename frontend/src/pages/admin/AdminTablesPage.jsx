import React, { useState, useEffect, useCallback } from 'react';
import { Users, X } from 'lucide-react';
import { adminTableApi, adminOrderApi } from '../../api/apiClient';
import { PageLoader, PageError } from '../../components/PageState';
import useWebSocket from '../../hooks/useWebSocket';

const STATUS = {
  open:     { label: 'Open',     color: '#e8f5e0', border: '#7aad5a', text: 'var(--sage)' },
  occupied: { label: 'Occupied', color: '#fff4e0', border: '#d4a03a', text: 'var(--gold-muted)' },
  dirty:    { label: 'Dirty',    color: 'var(--washi-dark)', border: '#bbb', text: 'var(--stone)' },
};

function TableDetailModal({ table, onClose, onStatusChange }) {
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (table.status === 'occupied') {
      setLoadingOrder(true);
      adminOrderApi.getByTable(table.id)
        .then(({ data }) => setOrder(data.data))
        .catch(() => setOrder(null))
        .finally(() => setLoadingOrder(false));
    } else {
      setOrder(null);
    }
  }, [table.id, table.status]);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try { await onStatusChange(table.id, newStatus); }
    finally { setUpdatingStatus(false); }
  };

  const st = STATUS[table.status] || STATUS.open;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--ink)' }}>Table {table.tableNumber}</h2>
            <span style={{ display: 'inline-block', padding: '0.15rem 0.5rem', background: st.color, border: '1px solid ' + st.border, borderRadius: 2, fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: st.text, marginTop: '0.3rem' }}>{st.label}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone)' }}><X size={20} /></button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.6rem' }}>Change Status</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.entries(STATUS).map(([key, val]) => (
              <button key={key} disabled={updatingStatus || table.status === key} onClick={() => handleStatusChange(key)}
                style={{ padding: '0.35rem 0.75rem', background: table.status === key ? val.color : 'transparent', border: '1px solid ' + (table.status === key ? val.border : 'var(--washi-dark)'), borderRadius: 2, fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: table.status === key ? val.text : 'var(--stone)', cursor: updatingStatus ? 'not-allowed' : 'pointer', opacity: updatingStatus ? 0.6 : 1 }}>
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {loadingOrder && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--stone-light)', padding: '1rem 0' }}>Loading order…</p>}
        {!loadingOrder && order && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone)' }}>Current Order</p>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'var(--gold)' }}>{order.receiptNumber}</span>
            </div>
            {(order.items || []).map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--washi-dark)' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--ink)' }}>{item.itemName} <span style={{ color: 'var(--stone)', fontSize: '0.75rem' }}>x {item.quantity}</span></span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--ink)' }}>RM {Number(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 500, color: 'var(--ink)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold)' }}>RM {Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        )}
        {!loadingOrder && !order && (
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--stone-light)', fontSize: '0.85rem', padding: '1rem 0', textAlign: 'center' }}>No active orders for this table</p>
        )}
      </div>
    </div>
  );
}

export default function AdminTablesPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const fetchTables = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await adminTableApi.getAll();
      setTables(data.data || []);
    } catch { setError('Could not load tables. Please retry.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  useWebSocket({
    '/topic/tables': (updated) => {
      setTables(prev => prev.map(t => t.id === updated.id ? { ...t, status: updated.status } : t));
    },
  });

  const handleStatusChange = async (tableId, newStatus) => {
    const { data } = await adminTableApi.updateStatus(tableId, newStatus);
    setTables(prev => prev.map(t => t.id === tableId ? data.data : t));
    if (selected?.id === tableId) setSelected(prev => ({ ...prev, status: newStatus }));
  };

  const counts = tables.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {});

  if (loading) return <PageLoader label="Loading table map…" />;
  if (error)   return <PageError message={error} onRetry={fetchTables} />;

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>テーブル管理</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--ink)' }}>Table Map</h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--stone-light)', marginTop: '0.25rem' }}>Live via WebSocket — updates instantly across all admin screens</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {Object.entries(STATUS).map(([key, val]) => (
          <div key={key} style={{ padding: '0.6rem 1rem', background: val.color, border: '1px solid ' + val.border, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: val.text }}>{counts[key] || 0}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: val.text }}>{val.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem' }}>
        {tables.map(table => {
          const st = STATUS[table.status] || STATUS.open;
          return (
            <button key={table.id} onClick={() => setSelected(table)}
              style={{ padding: '1.25rem 0.75rem', background: st.color, border: '1px solid ' + st.border, borderRadius: 4, cursor: 'pointer', textAlign: 'center', transition: 'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <Users size={18} color={st.text} style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 500, color: st.text, marginBottom: '0.2rem' }}>{table.tableNumber}</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: st.text, opacity: 0.8 }}>{st.label}</p>
            </button>
          );
        })}
      </div>

      {selected && (
        <TableDetailModal
          table={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
