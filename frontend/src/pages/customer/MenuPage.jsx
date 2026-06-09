import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, Check, AlertCircle, RefreshCw } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/AppContext';
import { publicApi } from '../../api/apiClient';

// ── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--washi)', border: '1px solid var(--washi-dark)',
      borderRadius: 4, padding: '1.5rem', display: 'flex', gap: '1rem',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ height: 18, width: '60%', background: 'var(--washi-dark)', borderRadius: 2, marginBottom: 10, animation: 'pulse 1.5s ease infinite' }} />
        <div style={{ height: 13, width: '90%', background: 'var(--washi-dark)', borderRadius: 2, marginBottom: 6, animation: 'pulse 1.5s ease infinite' }} />
        <div style={{ height: 13, width: '70%', background: 'var(--washi-dark)', borderRadius: 2, animation: 'pulse 1.5s ease infinite' }} />
      </div>
      <div style={{ width: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
        <div style={{ height: 22, width: 55, background: 'var(--washi-dark)', borderRadius: 2, animation: 'pulse 1.5s ease infinite' }} />
        <div style={{ height: 30, width: 55, background: 'var(--washi-dark)', borderRadius: 2, animation: 'pulse 1.5s ease infinite' }} />
      </div>
    </div>
  );
}

// ── Menu item card ────────────────────────────────────────────────────────────
function MenuItemCard({ item }) {
  const { items, dispatch } = useCart();
  const inCart = items.find(i => i.id === item.id);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    dispatch({ type: 'ADD', item });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };
  const handleQty = (delta) => {
    const newQty = (inCart?.qty || 0) + delta;
    if (newQty <= 0) dispatch({ type: 'REMOVE', id: item.id });
    else dispatch({ type: 'UPDATE_QTY', id: item.id, qty: newQty });
  };

  return (
    <div
      style={{
        background: 'var(--washi)', border: '1px solid var(--washi-dark)',
        borderRadius: 4, padding: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(184,146,42,0.35)'; e.currentTarget.style.boxShadow='0 2px 16px rgba(184,146,42,0.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--washi-dark)'; e.currentTarget.style.boxShadow='none'; }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 500, color: 'var(--ink)' }}>
            {item.name}
          </h3>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--stone)', fontStyle: 'italic' }}>
            {item.nameJp}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--stone)', lineHeight: 1.65, marginBottom: '1rem', fontWeight: 300 }}>
          {item.description}
        </p>
        <span style={{
          display: 'inline-block', padding: '0.15rem 0.5rem',
          background: item.routingStation === 'bar' ? 'rgba(74,94,58,0.12)' : 'rgba(139,26,26,0.08)',
          color: item.routingStation === 'bar' ? 'var(--sage)' : 'var(--red-lacquer)',
          fontFamily: 'var(--font-ui)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          borderRadius: 2, border: `1px solid ${item.routingStation === 'bar' ? 'rgba(74,94,58,0.25)' : 'rgba(139,26,26,0.2)'}`,
        }}>
          {item.routingStation === 'bar' ? 'Bar' : 'Kitchen'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 500, color: 'var(--gold)' }}>
          RM {Number(item.price).toFixed(2)}
        </span>
        {inCart ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--washi-dark)', borderRadius: 2, overflow: 'hidden' }}>
            <button onClick={() => handleQty(-1)} style={{ padding: '0.35rem 0.6rem', background: 'var(--washi-warm)', border: 'none', cursor: 'pointer', color: 'var(--ink)', display: 'flex', alignItems: 'center' }}>
              <Minus size={12} />
            </button>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink)', minWidth: 20, textAlign: 'center' }}>
              {inCart.qty}
            </span>
            <button onClick={() => handleQty(1)} style={{ padding: '0.35rem 0.6rem', background: 'var(--washi-warm)', border: 'none', cursor: 'pointer', color: 'var(--ink)', display: 'flex', alignItems: 'center' }}>
              <Plus size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0.4rem 1rem',
              background: added ? 'var(--sage)' : 'var(--ink)',
              color: 'var(--washi)', fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              border: 'none', borderRadius: 2, cursor: 'pointer',
              transition: 'background 0.3s', whiteSpace: 'nowrap',
            }}
          >
            {added ? <><Check size={12} /> Added</> : <><Plus size={12} /> Add</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MenuPage() {
  const { itemCount, total } = useCart();
  const navigate = useNavigate();

  const [categories, setCategories]     = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const fetchMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await publicApi.getMenu();
      const cats = data.data || [];
      setCategories(cats);
      if (cats.length > 0) setActiveCategory(cats[0].id);
    } catch (err) {
      setError('Could not load the menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  const activeCat = categories.find(c => c.id === activeCategory);

  return (
    <div style={{ background: 'var(--washi)', minHeight: '100vh' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      <Navbar dark />

      {/* Page header */}
      <div style={{ background: 'var(--ink)', padding: '6rem 1.5rem 3rem', textAlign: 'center', borderBottom: '1px solid rgba(184,146,42,0.15)' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>お品書き</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 300, color: 'var(--washi)' }}>Our Menu</h1>
      </div>

      {/* Category tabs */}
      <div style={{ background: 'var(--ink-soft)', borderBottom: '1px solid rgba(184,146,42,0.12)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ display: 'flex', padding: '0 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
          {loading
            ? [1,2,3,4,5].map(i => (
                <div key={i} style={{ padding: '1rem 1.5rem', width: 100, height: 44, background: 'rgba(245,240,232,0.05)', margin: '0 2px', animation: 'pulse 1.5s ease infinite' }} />
              ))
            : categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '1rem 1.5rem',
                    fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: activeCategory === cat.id ? 'var(--gold)' : 'rgba(245,240,232,0.5)',
                    background: 'none', border: 'none',
                    borderBottom: activeCategory === cat.id ? '2px solid var(--gold)' : '2px solid transparent',
                    cursor: 'pointer', transition: 'color 0.2s', whiteSpace: 'nowrap',
                  }}
                >
                  {cat.name}
                </button>
              ))
          }
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.5rem', background: 'rgba(139,26,26,0.08)', border: '1px solid rgba(139,26,26,0.2)', borderRadius: 4, marginBottom: '2rem' }}>
            <AlertCircle size={18} color="var(--red-lacquer)" />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--red-lacquer)', flex: 1 }}>{error}</span>
            <button onClick={fetchMenu} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.4rem 0.8rem', background: 'var(--ink)', color: 'var(--washi)', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', border: 'none', borderRadius: 2, cursor: 'pointer' }}>
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,440px),1fr))', gap: '1rem' }}>
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : activeCat ? (
          <div className="page-enter">
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--ink)' }}>{activeCat.name}</h2>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--stone)' }}>{activeCat.nameJp}</span>
              </div>
              <div style={{ height: 1, background: 'linear-gradient(to right, var(--gold-muted), transparent)', marginTop: '1rem', opacity: 0.4 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,440px),1fr))', gap: '1rem' }}>
              {(activeCat.items || []).map(item => <MenuItemCard key={item.id} item={item} />)}
            </div>
          </div>
        ) : null}
      </div>

      {/* Sticky cart bar */}
      {itemCount > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--ink)', borderTop: '1px solid rgba(184,146,42,0.3)',
          padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 400, boxShadow: '0 -4px 24px rgba(15,13,8,0.5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag size={18} color="var(--gold)" />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--washi)' }}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)' }}>
              RM {total.toFixed(2)}
            </span>
            <button
              onClick={() => navigate('/checkout')}
              style={{ padding: '0.55rem 1.5rem', background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: 2, cursor: 'pointer' }}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
      {itemCount > 0 && <div style={{ height: 70 }} />}
    </div>
  );
}
