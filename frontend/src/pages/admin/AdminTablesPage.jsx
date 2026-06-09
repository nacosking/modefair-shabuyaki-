import React, { useState } from 'react';
import { Users, X, ChevronRight } from 'lucide-react';

const TABLE_COUNT = 20;

const STATUS = {
  available: { label: 'Available', color: '#e8f5e0', border: '#7aad5a', text: 'var(--sage)' },
  occupied:  { label: 'Occupied',  color: '#fff4e0', border: '#d4a03a', text: 'var(--gold-muted)' },
  reserved:  { label: 'Reserved',  color: '#f0e8e8', border: '#c07070', text: 'var(--red-lacquer)' },
  cleaning:  { label: 'Cleaning',  color: 'var(--washi-dark)', border: '#bbb', text: 'var(--stone)' },
};

const DEMO_ORDERS = {
  3:  [{ name: 'A5 Wagyu Striploin', qty: 2, price: 98 }, { name: 'Junmai Daiginjo Sake', qty: 2, price: 22 }],
  5:  [{ name: 'Otoro Tuna', qty: 3, price: 48 }, { name: 'Miso Black Cod', qty: 1, price: 56 }, { name: 'Hojicha Latte', qty: 2, price: 10 }],
  8:  [{ name: 'Uni Ikura Don', qty: 2, price: 72 }, { name: 'Matcha Soufflé', qty: 2, price: 24 }],
  12: [{ name: 'King Salmon', qty: 4, price: 36 }, { name: 'Nikka Whisky Highball', qty: 3, price: 18 }],
  17: [{ name: 'Kani Chawanmushi', qty: 2, price: 32 }, { name: 'Eggplant Dengaku', qty: 1, price: 28 }, { name: 'Yuzu Gin Sour', qty: 2, price: 20 }],
};

const INITIAL_STATUSES = Object.fromEntries(
  Array.from({ length: TABLE_COUNT }, (_, i) => {
    const n = i + 1;
    if ([3, 5, 8, 12, 17].includes(n)) return [n, 'occupied'];
    if ([2, 9, 14].includes(n)) return [n, 'reserved'];
    if ([7].includes(n)) return [n, 'cleaning'];
    return [n, 'available'];
  })
);

function TableDetailModal({ tableNum, status, orders, onClose, onStatusChange }) {
  const total = orders?.reduce((s, o) => s + o.price * o.qty, 0) ?? 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--ink)' }}>
              Table {tableNum}
            </h2>
            <span style={{
              display: 'inline-block',
              padding: '0.15rem 0.5rem',
              background: STATUS[status].color,
              border: `1px solid ${STATUS[status].border}`,
              borderRadius: 2,
              fontFamily: 'var(--font-ui)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: STATUS[status].text,
              marginTop: '0.3rem',
            }}>
              {STATUS[status].label}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Change status */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--stone)',
            marginBottom: '0.6rem',
          }}>
            Change Status
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.entries(STATUS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => onStatusChange(tableNum, key)}
                style={{
                  padding: '0.35rem 0.75rem',
                  background: status === key ? val.color : 'transparent',
                  border: `1px solid ${status === key ? val.border : 'var(--washi-dark)'}`,
                  borderRadius: 2,
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.7rem',
                  color: status === key ? val.text : 'var(--stone)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders */}
        {orders && orders.length > 0 ? (
          <div>
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--stone)',
              marginBottom: '0.75rem',
            }}>
              Current Order
            </p>
            {orders.map((o, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--washi-dark)',
              }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--ink)' }}>
                  {o.name} <span style={{ color: 'var(--stone)', fontSize: '0.75rem' }}>× {o.qty}</span>
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--ink)' }}>
                  RM {(o.price * o.qty).toFixed(2)}
                </span>
              </div>
            ))}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              paddingTop: '0.75rem',
              marginTop: '0.25rem',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 500, color: 'var(--ink)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold)' }}>
                RM {total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                marginTop: '1.25rem', width: '100%',
                padding: '0.7rem',
                background: 'var(--ink)', color: 'var(--washi)',
                fontFamily: 'var(--font-ui)', fontSize: '0.75rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                border: 'none', borderRadius: 2, cursor: 'pointer',
              }}
            >
              Print Bill
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--stone-light)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              No active orders for this table
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminTablesPage() {
  const [statuses, setStatuses] = useState(INITIAL_STATUSES);
  const [selected, setSelected] = useState(null);

  const handleStatusChange = (num, newStatus) => {
    setStatuses(s => ({ ...s, [num]: newStatus }));
  };

  const counts = Object.values(statuses).reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="page-enter">
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '0.3rem',
        }}>テーブル管理</p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 400,
          color: 'var(--ink)',
        }}>
          Table Map
        </h1>
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'flex', gap: '1rem', flexWrap: 'wrap',
        marginBottom: '2rem',
      }}>
        {Object.entries(STATUS).map(([key, val]) => (
          <div key={key} style={{
            padding: '0.6rem 1rem',
            background: val.color,
            border: `1px solid ${val.border}`,
            borderRadius: 3,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              color: val.text,
            }}>
              {counts[key] || 0}
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: val.text,
            }}>
              {val.label}
            </span>
          </div>
        ))}
      </div>

      {/* Table grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '0.75rem',
      }}>
        {Array.from({ length: TABLE_COUNT }, (_, i) => {
          const n = i + 1;
          const s = statuses[n];
          const st = STATUS[s];
          const hasOrders = !!DEMO_ORDERS[n];

          return (
            <button
              key={n}
              onClick={() => setSelected(n)}
              style={{
                padding: '1.25rem 0.75rem',
                background: st.color,
                border: `1px solid ${st.border}`,
                borderRadius: 4,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'transform 0.15s, box-shadow 0.15s',
                position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {hasOrders && (
                <div style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 7, height: 7,
                  borderRadius: '50%',
                  background: 'var(--gold)',
                }} />
              )}
              <Users size={18} color={st.text} style={{ margin: '0 auto 0.5rem' }} />
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 500,
                color: st.text,
                marginBottom: '0.2rem',
              }}>
                {n}
              </p>
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: st.text,
                opacity: 0.8,
              }}>
                {st.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '1.5rem',
        display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--stone-light)', letterSpacing: '0.1em' }}>
          • Gold dot = active order
        </span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--stone-light)' }}> · </span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--stone-light)' }}>
          Click any table to view details or change status
        </span>
      </div>

      {/* Detail modal */}
      {selected && (
        <TableDetailModal
          tableNum={selected}
          status={statuses[selected]}
          orders={DEMO_ORDERS[selected]}
          onClose={() => setSelected(null)}
          onStatusChange={(n, s) => { handleStatusChange(n, s); }}
        />
      )}
    </div>
  );
}
