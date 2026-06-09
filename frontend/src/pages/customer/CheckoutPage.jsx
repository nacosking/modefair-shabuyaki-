import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Tag, CheckCircle, MapPin, Phone, Clock, Printer, Loader } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/AppContext';
import { publicApi } from '../../api/apiClient';

// ── Discount codes (mirrors backend — used for optimistic UI only) ─────────────
const LOCAL_DISCOUNTS = [
  { code: 'WELCOME10', label: '10% Welcome', type: 'percent', value: 10 },
  { code: 'OMAKASE20', label: '20% Omakase', type: 'percent', value: 20 },
  { code: 'FLAT15',    label: 'RM15 Off',    type: 'flat',    value: 15 },
];

// ── Receipt Modal ─────────────────────────────────────────────────────────────
function ReceiptModal({ order, onClose }) {
  const dateStr = new Date(order.createdAt || Date.now()).toLocaleString('en-MY', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--washi-dark)' }}>
          <div style={{ width: 48, height: 48, background: 'var(--sage)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <CheckCircle size={24} color="#fff" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--ink)' }}>Arigato Gozaimasu</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--stone)', marginTop: '0.3rem', fontStyle: 'italic' }}>ありがとうございます</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--gold)', marginTop: '0.5rem' }}>
            {order.receiptNumber}
          </p>
        </div>

        {/* Restaurant info */}
        <div style={{ background: 'var(--ink)', borderRadius: 4, padding: '1rem', marginBottom: '1.5rem', color: 'var(--washi)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>
            {order.restaurantName || 'Shabuyaki'}
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: '0.3rem' }}>
            <MapPin size={12} style={{ color: 'var(--stone-light)', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--stone-light)', lineHeight: 1.5 }}>
              {order.restaurantAddress}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.3rem' }}>
            <Phone size={12} style={{ color: 'var(--stone-light)' }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--stone-light)' }}>{order.restaurantPhone}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={12} style={{ color: 'var(--stone-light)' }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--stone-light)' }}>{dateStr}</p>
          </div>
        </div>

        {/* Table number */}
        <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', background: 'var(--washi-warm)', borderRadius: 3 }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--stone)', textTransform: 'uppercase' }}>
            Table {order.tableNumber}
          </span>
        </div>

        {/* Order items */}
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.75rem' }}>
            Order Details
          </p>
          {(order.items || []).map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0.4rem 0', borderBottom: '1px solid var(--washi-dark)' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--ink)' }}>{item.itemName}</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--stone)', marginLeft: '0.4rem' }}>× {item.quantity}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--ink)' }}>
                RM {Number(item.lineTotal).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ background: 'var(--washi-warm)', borderRadius: 4, padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--stone)' }}>Subtotal</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--ink)' }}>RM {Number(order.subtotal).toFixed(2)}</span>
          </div>
          {order.discountCode && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--sage)' }}>Discount ({order.discountCode})</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--sage)' }}>− RM {Number(order.discountAmount).toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--washi-dark)', marginTop: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 500, color: 'var(--ink)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 500, color: 'var(--gold)' }}>
              RM {Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => window.print()} style={{ flex: 1, padding: '0.7rem', background: 'var(--ink)', color: 'var(--washi)', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Printer size={14} /> Print
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '0.7rem', background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: 2, cursor: 'pointer' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Checkout Page ────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, dispatch, subtotal, discount, setDiscount, itemCount } = useCart();

  const [tableInput, setTableInput]   = useState('');
  const [tableError, setTableError]   = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [placing, setPlacing]         = useState(false);
  const [apiError, setApiError]       = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Client-side discount preview (server recalculates authoritatively)
  const discountAmount = discount
    ? discount.type === 'percent'
      ? (subtotal * discount.value) / 100
      : Math.min(discount.value, subtotal)
    : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const applyDiscount = () => {
    const found = LOCAL_DISCOUNTS.find(d => d.code === couponInput.trim().toUpperCase());
    if (found) { setDiscount(found); setCouponError(''); setCouponSuccess(`"${found.label}" applied!`); }
    else        { setCouponError('Invalid promo code'); setCouponSuccess(''); }
  };
  const removeDiscount = () => { setDiscount(null); setCouponInput(''); setCouponError(''); setCouponSuccess(''); };

  const handlePay = async () => {
    if (!tableInput || isNaN(Number(tableInput)) || Number(tableInput) < 1) {
      setTableError('Please enter a valid table number');
      return;
    }
    setTableError('');
    setApiError('');
    setPlacing(true);

    try {
      const payload = {
        tableNumber: Number(tableInput),
        items: items.map(i => ({ menuItemId: i.id, quantity: i.qty })),
        discountCode: discount?.code || null,
      };
      const { data } = await publicApi.checkout(payload);
      setCompletedOrder(data.data);
      dispatch({ type: 'CLEAR' });
      setDiscount(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not place order. Please try again.';
      setApiError(msg);
    } finally {
      setPlacing(false);
    }
  };

  if (itemCount === 0 && !completedOrder) {
    return (
      <div style={{ background: 'var(--washi)', minHeight: '100vh' }}>
        <Navbar dark />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: 'var(--washi-dark)', marginBottom: '1rem' }}>侘</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--ink)', marginBottom: '0.5rem' }}>Your cart is empty</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--stone)', marginBottom: '2rem' }}>Discover something wonderful from our menu</p>
          <button onClick={() => navigate('/menu')} className="btn-primary">Browse Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--washi)', minHeight: '100vh' }}>
      <Navbar dark />

      <div style={{ background: 'var(--ink)', padding: '6rem 1.5rem 3rem', textAlign: 'center', borderBottom: '1px solid rgba(184,146,42,0.15)' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>お会計</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 300, color: 'var(--washi)' }}>Checkout</h1>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) min(100%,340px)', gap: '2rem', alignItems: 'start' }} className="checkout-grid">

        {/* Left — cart items */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '1.25rem' }}>Your Order</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--washi-warm)', border: '1px solid var(--washi-dark)', borderRadius: 4, padding: '1rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: item.routingStation === 'bar' ? 'var(--sage)' : 'var(--red-lacquer)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink)' }}>{item.name}</p>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--stone)' }}>RM {Number(item.price).toFixed(2)} each</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--washi-dark)', borderRadius: 2, overflow: 'hidden' }}>
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty - 1 })} style={{ padding: '0.3rem 0.6rem', background: 'var(--washi)', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--ink)' }}>−</button>
                  <span style={{ padding: '0.3rem 0.75rem', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--ink)', minWidth: 32, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })} style={{ padding: '0.3rem 0.6rem', background: 'var(--washi)', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--ink)' }}>+</button>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--ink)', minWidth: 72, textAlign: 'right' }}>
                  RM {(item.price * item.qty).toFixed(2)}
                </span>
                <button onClick={() => dispatch({ type: 'REMOVE', id: item.id })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-light)', padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Table number input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.5rem' }}>
              Table Number
            </label>
            <input
              type="number" min="1" max="20"
              value={tableInput}
              onChange={e => setTableInput(e.target.value)}
              placeholder="Enter your table number (1–20)"
              style={{ width: '100%', maxWidth: 280, padding: '0.6rem 0.9rem', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', background: 'var(--washi)', border: `1px solid ${tableError ? 'var(--red-lacquer)' : 'var(--washi-dark)'}`, borderRadius: 2, color: 'var(--ink)', outline: 'none' }}
            />
            {tableError && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--red-lacquer)', marginTop: '0.4rem' }}>{tableError}</p>}
          </div>

          {/* Promo code */}
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tag size={12} /> Promo Code
            </p>
            {discount ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(74,94,58,0.1)', border: '1px solid rgba(74,94,58,0.25)', borderRadius: 4, padding: '0.75rem 1rem' }}>
                <CheckCircle size={16} color="var(--sage)" />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--sage)', flex: 1 }}>{discount.label} applied</span>
                <button onClick={removeDiscount} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--stone)', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && applyDiscount()}
                  placeholder="e.g. WELCOME10"
                  style={{ flex: 1, padding: '0.6rem 0.9rem', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', background: 'var(--washi)', border: `1px solid ${couponError ? 'var(--red-lacquer)' : 'var(--washi-dark)'}`, borderRadius: 2, color: 'var(--ink)', outline: 'none' }}
                />
                <button onClick={applyDiscount} style={{ padding: '0.6rem 1.2rem', background: 'var(--ink)', color: 'var(--gold)', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: 2, cursor: 'pointer' }}>
                  Apply
                </button>
              </div>
            )}
            {couponError && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--red-lacquer)', marginTop: '0.4rem' }}>{couponError}</p>}
            {couponSuccess && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--sage)', marginTop: '0.4rem' }}>{couponSuccess}</p>}
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'var(--stone-light)', marginTop: '0.4rem' }}>Try: WELCOME10 · OMAKASE20 · FLAT15</p>
          </div>
        </div>

        {/* Right — summary + pay */}
        <div style={{ background: 'var(--ink)', borderRadius: 4, padding: '1.75rem', color: 'var(--washi)', position: 'sticky', top: '5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--washi)', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(245,240,232,0.1)' }}>
            Order Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--stone-light)' }}>Subtotal ({itemCount} items)</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--washi)' }}>RM {subtotal.toFixed(2)}</span>
            </div>
            {discount && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--sage-light)' }}>Discount</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--sage-light)' }}>− RM {discountAmount.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(245,240,232,0.1)', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--washi)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)' }}>RM {total.toFixed(2)}</span>
          </div>

          {apiError && (
            <div style={{ padding: '0.75rem', background: 'rgba(139,26,26,0.2)', border: '1px solid rgba(139,26,26,0.3)', borderRadius: 2, marginBottom: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#e07070' }}>{apiError}</p>
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={placing}
            style={{ width: '100%', padding: '1rem', background: placing ? 'var(--gold-muted)' : 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', borderRadius: 2, cursor: placing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
          >
            {placing ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Placing order…</> : 'Confirm & Pay'}
          </button>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'var(--stone-light)', textAlign: 'center', marginTop: '0.75rem' }}>
            Payment processed at the table
          </p>
        </div>
      </div>

      {completedOrder && <ReceiptModal order={completedOrder} onClose={() => { setCompletedOrder(null); navigate('/'); }} />}

      <style>{`
        .checkout-grid { grid-template-columns: minmax(0,1fr) min(100%,340px); }
        @media (max-width:700px) { .checkout-grid { grid-template-columns: 1fr !important; } }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
