import React, { useState } from 'react';
import { ChefHat, Wine, Clock, CheckCircle, AlertCircle, Scissors } from 'lucide-react';

const STATION_COLORS = {
  kitchen: { bg: 'rgba(139,26,26,0.07)', border: 'rgba(139,26,26,0.2)', text: 'var(--red-lacquer)', label: 'Kitchen', icon: ChefHat },
  bar:     { bg: 'rgba(74,94,58,0.08)',  border: 'rgba(74,94,58,0.22)', text: 'var(--sage)',         label: 'Bar',     icon: Wine },
};

const TICKET_STATUS = {
  pending:    { label: 'Pending',    color: 'rgba(184,146,42,0.15)', border: 'rgba(184,146,42,0.3)', text: 'var(--gold-muted)', icon: Clock },
  preparing:  { label: 'Preparing', color: 'rgba(139,26,26,0.1)',   border: 'rgba(139,26,26,0.25)', text: 'var(--red-lacquer)', icon: AlertCircle },
  ready:      { label: 'Ready',     color: 'rgba(74,94,58,0.12)',   border: 'rgba(74,94,58,0.3)',   text: 'var(--sage)', icon: CheckCircle },
};

const INITIAL_TICKETS = [
  { id: 't1', table: 3,  station: 'kitchen', items: [{ name: 'A5 Wagyu Striploin', qty: 2 }, { name: 'Kani Chawanmushi', qty: 1 }], status: 'preparing', time: '18:32', guests: 2 },
  { id: 't2', table: 3,  station: 'bar',     items: [{ name: 'Junmai Daiginjo Sake', qty: 2 }], status: 'ready', time: '18:33', guests: 2 },
  { id: 't3', table: 5,  station: 'kitchen', items: [{ name: 'Otoro Tuna', qty: 3 }, { name: 'Miso Black Cod', qty: 1 }], status: 'pending', time: '18:47', guests: 4 },
  { id: 't4', table: 5,  station: 'bar',     items: [{ name: 'Hojicha Latte', qty: 2 }], status: 'preparing', time: '18:48', guests: 4 },
  { id: 't5', table: 8,  station: 'kitchen', items: [{ name: 'Uni Ikura Don', qty: 2 }, { name: 'Matcha Soufflé', qty: 2 }], status: 'pending', time: '19:01', guests: 2 },
  { id: 't6', table: 12, station: 'kitchen', items: [{ name: 'King Salmon', qty: 4 }], status: 'ready', time: '19:05', guests: 4 },
  { id: 't7', table: 12, station: 'bar',     items: [{ name: 'Nikka Whisky Highball', qty: 3 }], status: 'ready', time: '19:06', guests: 4 },
  { id: 't8', table: 17, station: 'kitchen', items: [{ name: 'Eggplant Dengaku', qty: 1 }], status: 'preparing', time: '19:14', guests: 3 },
  { id: 't9', table: 17, station: 'bar',     items: [{ name: 'Yuzu Gin Sour', qty: 2 }], status: 'pending', time: '19:15', guests: 3 },
];

function SplitModal({ ticket, onClose }) {
  const [guests, setGuests] = useState(ticket.guests || 2);
  const totalItems = ticket.items.reduce((s, i) => s + i.qty, 0);
  const perGuest = Math.ceil(totalItems / guests);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)' }}>
            Split Check — Table {ticket.table}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--stone)' }}>×</button>
        </div>

        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--stone)', marginBottom: '1.25rem' }}>
          {ticket.items.length} item type(s) · {totalItems} total dishes
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.5rem' }}>
            Split between
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => setGuests(g => Math.max(2, g - 1))}
              style={{ width: 36, height: 36, borderRadius: 2, border: '1px solid var(--washi-dark)', background: 'var(--washi-warm)', cursor: 'pointer', fontSize: '1rem', color: 'var(--ink)' }}>
              −
            </button>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--ink)', minWidth: 40, textAlign: 'center' }}>
              {guests}
            </span>
            <button onClick={() => setGuests(g => Math.min(12, g + 1))}
              style={{ width: 36, height: 36, borderRadius: 2, border: '1px solid var(--washi-dark)', background: 'var(--washi-warm)', cursor: 'pointer', fontSize: '1rem', color: 'var(--ink)' }}>
              +
            </button>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--stone)' }}>guests</span>
          </div>
        </div>

        <div style={{ background: 'var(--washi-warm)', borderRadius: 3, padding: '1rem', marginBottom: '1.25rem' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--stone)', marginBottom: '0.5rem' }}>
            Split summary
          </p>
          {Array.from({ length: guests }, (_, i) => (
            <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--ink)', padding: '0.2rem 0' }}>
              Guest {i + 1}: ~{i < totalItems % guests || totalItems % guests === 0 ? perGuest : Math.floor(totalItems / guests)} dishes
            </p>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.7rem', background: 'var(--washi-warm)', border: '1px solid var(--washi-dark)', borderRadius: 2, fontFamily: 'var(--font-ui)', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--stone)' }}>
            Cancel
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '0.7rem', background: 'var(--gold)', border: 'none', borderRadius: 2, fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', color: 'var(--ink)' }}>
            Apply Split
          </button>
        </div>
      </div>
    </div>
  );
}

function TicketCard({ ticket, onStatusChange, onSplit }) {
  const st = STATION_COLORS[ticket.station];
  const ts = TICKET_STATUS[ticket.status];
  const StatusIcon = ts.icon;
  const StationIcon = st.icon;

  const nextStatus = { pending: 'preparing', preparing: 'ready', ready: 'pending' };

  return (
    <div style={{
      background: 'var(--washi)',
      border: '1px solid var(--washi-dark)',
      borderLeft: `3px solid ${ticket.station === 'bar' ? 'var(--sage)' : 'var(--red-lacquer)'}`,
      borderRadius: 4,
      padding: '1.25rem',
      marginBottom: '0.75rem',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.3rem' }}>
            <StationIcon size={14} color={st.text} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: st.text }}>
              {st.label}
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--ink)' }}>
            Table {ticket.table}
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--stone-light)' }}>
            {ticket.time} · {ticket.guests} guests
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{
            padding: '0.2rem 0.6rem',
            background: ts.color,
            border: `1px solid ${ts.border}`,
            borderRadius: 2,
            fontFamily: 'var(--font-ui)',
            fontSize: '0.62rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: ts.text,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <StatusIcon size={10} />
            {ts.label}
          </span>
        </div>
      </div>

      {/* Items */}
      <div style={{ marginBottom: '1rem' }}>
        {ticket.items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '0.3rem 0',
            borderBottom: i < ticket.items.length - 1 ? '1px solid var(--washi-warm)' : 'none',
          }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--ink)' }}>{item.name}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--stone)', fontWeight: 500 }}>×{item.qty}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => onStatusChange(ticket.id, nextStatus[ticket.status])}
          style={{
            flex: 1,
            padding: '0.5rem',
            background: 'var(--ink)',
            color: 'var(--washi)',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.7rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          → {TICKET_STATUS[nextStatus[ticket.status]].label}
        </button>
        <button
          onClick={() => onSplit(ticket)}
          style={{
            padding: '0.5rem 0.75rem',
            background: 'transparent',
            color: 'var(--stone)',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.7rem',
            border: '1px solid var(--washi-dark)',
            borderRadius: 2,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <Scissors size={12} /> Split
        </button>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [splitTicket, setSplitTicket] = useState(null);
  const [filterStation, setFilterStation] = useState('all');

  const handleStatusChange = (id, newStatus) => {
    setTickets(ts => ts.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const kitchenTickets = tickets.filter(t => t.station === 'kitchen');
  const barTickets = tickets.filter(t => t.station === 'bar');
  const filteredKitchen = filterStation !== 'bar' ? kitchenTickets : [];
  const filteredBar = filterStation !== 'kitchen' ? barTickets : [];

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>
          注文管理
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--ink)' }}>
          Order Management
        </h1>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
        {[
          { key: 'all', label: 'All Stations' },
          { key: 'kitchen', label: '🍳 Kitchen' },
          { key: 'bar', label: '🍶 Bar' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterStation(key)}
            style={{
              padding: '0.45rem 1rem',
              background: filterStation === key ? 'var(--ink)' : 'var(--washi-warm)',
              color: filterStation === key ? 'var(--gold)' : 'var(--stone)',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              border: `1px solid ${filterStation === key ? 'var(--ink)' : 'var(--washi-dark)'}`,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        {/* Kitchen column */}
        {filterStation !== 'bar' && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: '1rem',
              padding: '0.6rem 1rem',
              background: 'rgba(139,26,26,0.07)',
              border: '1px solid rgba(139,26,26,0.18)',
              borderRadius: 3,
            }}>
              <ChefHat size={16} color="var(--red-lacquer)" />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red-lacquer)' }}>
                Kitchen ({kitchenTickets.length})
              </span>
            </div>
            {kitchenTickets.map(t => (
              <TicketCard key={t.id} ticket={t} onStatusChange={handleStatusChange} onSplit={setSplitTicket} />
            ))}
            {kitchenTickets.length === 0 && (
              <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--stone-light)', fontSize: '0.85rem', padding: '1rem 0' }}>
                No kitchen orders
              </p>
            )}
          </div>
        )}

        {/* Bar column */}
        {filterStation !== 'kitchen' && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: '1rem',
              padding: '0.6rem 1rem',
              background: 'rgba(74,94,58,0.08)',
              border: '1px solid rgba(74,94,58,0.2)',
              borderRadius: 3,
            }}>
              <Wine size={16} color="var(--sage)" />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)' }}>
                Bar ({barTickets.length})
              </span>
            </div>
            {barTickets.map(t => (
              <TicketCard key={t.id} ticket={t} onStatusChange={handleStatusChange} onSplit={setSplitTicket} />
            ))}
            {barTickets.length === 0 && (
              <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--stone-light)', fontSize: '0.85rem', padding: '1rem 0' }}>
                No bar orders
              </p>
            )}
          </div>
        )}
      </div>

      {splitTicket && (
        <SplitModal ticket={splitTicket} onClose={() => setSplitTicket(null)} />
      )}
    </div>
  );
}
