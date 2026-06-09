import React, { useState } from 'react';
import { ChefHat, Wine, Clock, CheckCircle, AlertCircle, Scissors } from 'lucide-react';
import { adminOrderApi } from '../../api/apiClient';
import useWebSocket from '../../hooks/useWebSocket';

const STATION = {
  kitchen: { text: 'var(--red-lacquer)', icon: ChefHat },
  bar:     { text: 'var(--sage)',         icon: Wine },
};
const PREP_ST = {
  pending:   { label: 'Pending',   color: 'rgba(184,146,42,0.15)', border: 'rgba(184,146,42,0.3)', text: 'var(--gold-muted)', icon: Clock },
  preparing: { label: 'Preparing', color: 'rgba(139,26,26,0.1)',   border: 'rgba(139,26,26,0.25)', text: 'var(--red-lacquer)', icon: AlertCircle },
  served:    { label: 'Served',    color: 'rgba(74,94,58,0.12)',   border: 'rgba(74,94,58,0.3)',   text: 'var(--sage)', icon: CheckCircle },
};
const NEXT = { pending: 'preparing', preparing: 'served' };

function SplitModal({ orderId, onClose }) {
  const [guestCount, setGuestCount] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handle = async () => {
    setLoading(true); setErr('');
    try {
      const { data } = await adminOrderApi.splitCheck(orderId, { splitType: 'evenly', guestCount });
      setResult(data.data);
    } catch (e) { setErr(e.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)' }}>Split Check</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--stone)' }}>x</button>
        </div>
        {!result ? (
          <>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.5rem' }}>Split between</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button onClick={() => setGuestCount(g => Math.max(2,g-1))} style={{ width:36, height:36, borderRadius:2, border:'1px solid var(--washi-dark)', background:'var(--washi-warm)', cursor:'pointer', fontSize:'1rem' }}>-</button>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', color:'var(--ink)', minWidth:40, textAlign:'center' }}>{guestCount}</span>
              <button onClick={() => setGuestCount(g => Math.min(12,g+1))} style={{ width:36, height:36, borderRadius:2, border:'1px solid var(--washi-dark)', background:'var(--washi-warm)', cursor:'pointer', fontSize:'1rem' }}>+</button>
            </div>
            {err && <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', color:'var(--red-lacquer)', marginBottom:'1rem' }}>{err}</p>}
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={onClose} style={{ flex:1, padding:'0.7rem', background:'var(--washi-warm)', border:'1px solid var(--washi-dark)', borderRadius:2, fontFamily:'var(--font-ui)', fontSize:'0.75rem', cursor:'pointer', color:'var(--stone)' }}>Cancel</button>
              <button onClick={handle} disabled={loading} style={{ flex:1, padding:'0.7rem', background:'var(--gold)', border:'none', borderRadius:2, fontFamily:'var(--font-ui)', fontSize:'0.75rem', fontWeight:500, cursor: loading ? 'not-allowed' : 'pointer', color:'var(--ink)' }}>{loading ? 'Calculating...' : 'Calculate'}</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.65rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--stone)', marginBottom:'0.75rem' }}>Result</p>
            {result.guestChecks.map(g => (
              <div key={g.guestNumber} style={{ display:'flex', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'1px solid var(--washi-dark)' }}>
                <span style={{ fontFamily:'var(--font-body)', fontSize:'0.9rem', color:'var(--ink)' }}>Guest {g.guestNumber}</span>
                <span style={{ fontFamily:'var(--font-display)', fontSize:'1rem', color:'var(--gold)' }}>RM {Number(g.amount).toFixed(2)}</span>
              </div>
            ))}
            <button onClick={onClose} style={{ width:'100%', marginTop:'1.25rem', padding:'0.7rem', background:'var(--ink)', border:'none', borderRadius:2, fontFamily:'var(--font-ui)', fontSize:'0.75rem', cursor:'pointer', color:'var(--gold)' }}>Done</button>
          </>
        )}
      </div>
    </div>
  );
}

function TicketCard({ ticket, onPrepUpdate, onSplit }) {
  const [updating, setUpdating] = useState(null);
  const stColor = ticket.station === 'bar' ? 'var(--sage)' : 'var(--red-lacquer)';
  const StIcon = (STATION[ticket.station] || STATION.kitchen).icon;

  const handleUpdate = async (itemId, nextStatus) => {
    setUpdating(itemId);
    try { await onPrepUpdate(itemId, nextStatus); }
    catch { alert('Failed to update status'); }
    finally { setUpdating(null); }
  };

  return (
    <div style={{ background:'var(--washi)', border:'1px solid var(--washi-dark)', borderLeft:'3px solid '+stColor, borderRadius:4, padding:'1.25rem', marginBottom:'0.75rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'0.3rem' }}>
            <StIcon size={14} color={stColor} />
            <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.65rem', letterSpacing:'0.12em', textTransform:'uppercase', color:stColor }}>{ticket.station}</span>
          </div>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--ink)' }}>Table {ticket.tableNumber}</p>
          <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.7rem', color:'var(--stone-light)' }}>{ticket.receiptNumber}</p>
        </div>
        <button onClick={() => onSplit(ticket)} style={{ padding:'0.35rem 0.6rem', background:'transparent', color:'var(--stone)', fontFamily:'var(--font-ui)', fontSize:'0.7rem', border:'1px solid var(--washi-dark)', borderRadius:2, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
          <Scissors size={12} /> Split
        </button>
      </div>
      {(ticket.items||[]).map(item => {
        const ps = PREP_ST[item.prepStatus] || PREP_ST.pending;
        const next = NEXT[item.prepStatus];
        const PsIcon = ps.icon;
        return (
          <div key={item.id || item.orderItemId} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.4rem 0', borderBottom:'1px solid var(--washi-warm)', gap:'0.5rem' }}>
            <div style={{ flex:1 }}>
              <span style={{ fontFamily:'var(--font-body)', fontSize:'0.85rem', color:'var(--ink)' }}>{item.itemName}</span>
              <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', color:'var(--stone)', marginLeft:6 }}>x{item.quantity}</span>
            </div>
            <span style={{ padding:'0.15rem 0.5rem', background:ps.color, border:'1px solid '+ps.border, borderRadius:2, fontFamily:'var(--font-ui)', fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', color:ps.text, display:'flex', alignItems:'center', gap:4, whiteSpace:'nowrap' }}>
              <PsIcon size={9} />{ps.label}
            </span>
            {next && (
              <button disabled={updating === (item.id || item.orderItemId)} onClick={() => handleUpdate(item.id || item.orderItemId, next)}
                style={{ padding:'0.2rem 0.6rem', background:'var(--ink)', color:'var(--washi)', fontFamily:'var(--font-ui)', fontSize:'0.62rem', border:'none', borderRadius:2, cursor:'pointer', whiteSpace:'nowrap', opacity: updating === (item.id||item.orderItemId) ? 0.5 : 1 }}>
                -&gt; {PREP_ST[next]?.label}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminOrdersPage() {
  const [tickets, setTickets] = useState([]);
  const [splitTarget, setSplitTarget] = useState(null);
  const [filter, setFilter] = useState('all');

  useWebSocket({
    '/topic/kitchen': (ticket) => setTickets(prev => {
      if (prev.find(t => t.orderId === ticket.orderId && t.station === 'kitchen')) return prev;
      return [{ ...ticket, station: 'kitchen', items: (ticket.items||[]).map(i => ({ ...i, prepStatus: 'pending' })) }, ...prev];
    }),
    '/topic/bar': (ticket) => setTickets(prev => {
      if (prev.find(t => t.orderId === ticket.orderId && t.station === 'bar')) return prev;
      return [{ ...ticket, station: 'bar', items: (ticket.items||[]).map(i => ({ ...i, prepStatus: 'pending' })) }, ...prev];
    }),
    '/topic/prep-status': (event) => setTickets(prev => prev.map(t => ({
      ...t,
      items: (t.items||[]).map(i => (i.id || i.orderItemId) === event.orderItemId ? { ...i, prepStatus: event.prepStatus } : i),
    }))),
  });

  const handlePrepUpdate = async (itemId, nextStatus) => {
    const { data } = await adminOrderApi.updatePrepStatus(itemId, nextStatus);
    setTickets(prev => prev.map(t => ({
      ...t,
      items: (t.items||[]).map(i => (i.id||i.orderItemId) === itemId ? { ...i, prepStatus: data.data.prepStatus } : i),
    })));
  };

  const kitchen = tickets.filter(t => t.station === 'kitchen');
  const bar = tickets.filter(t => t.station === 'bar');

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.3rem' }}>注文管理</p>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:400, color:'var(--ink)' }}>Order Management</h1>
        <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', color:'var(--stone-light)', marginTop:'0.25rem' }}>Tickets appear live as customers check out</p>
      </div>

      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.75rem' }}>
        {[['all','All'],['kitchen','Kitchen'],['bar','Bar']].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ padding:'0.45rem 1rem', background: filter===k ? 'var(--ink)' : 'var(--washi-warm)', color: filter===k ? 'var(--gold)' : 'var(--stone)', fontFamily:'var(--font-ui)', fontSize:'0.75rem', border:'1px solid var(--washi-dark)', borderRadius:2, cursor:'pointer' }}>{l}</button>
        ))}
      </div>

      {tickets.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem 2rem', color:'var(--stone-light)' }}>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'3rem', marginBottom:'1rem' }}>侘</p>
          <p style={{ fontFamily:'var(--font-body)', fontStyle:'italic' }}>No active tickets yet</p>
          <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', marginTop:'0.5rem' }}>Tickets appear here when customers complete checkout</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'1.5rem', alignItems:'start' }}>
          {filter !== 'bar' && kitchen.length > 0 && (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem', padding:'0.6rem 1rem', background:'rgba(139,26,26,0.07)', border:'1px solid rgba(139,26,26,0.18)', borderRadius:3 }}>
                <ChefHat size={16} color="var(--red-lacquer)" />
                <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.75rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--red-lacquer)' }}>Kitchen ({kitchen.length})</span>
              </div>
              {kitchen.map((t,i) => <TicketCard key={t.orderId+'-k'+i} ticket={t} onPrepUpdate={handlePrepUpdate} onSplit={setSplitTarget} />)}
            </div>
          )}
          {filter !== 'kitchen' && bar.length > 0 && (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem', padding:'0.6rem 1rem', background:'rgba(74,94,58,0.08)', border:'1px solid rgba(74,94,58,0.2)', borderRadius:3 }}>
                <Wine size={16} color="var(--sage)" />
                <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.75rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--sage)' }}>Bar ({bar.length})</span>
              </div>
              {bar.map((t,i) => <TicketCard key={t.orderId+'-b'+i} ticket={t} onPrepUpdate={handlePrepUpdate} onSplit={setSplitTarget} />)}
            </div>
          )}
        </div>
      )}

      {splitTarget && <SplitModal orderId={splitTarget.orderId} onClose={() => setSplitTarget(null)} />}
    </div>
  );
}
