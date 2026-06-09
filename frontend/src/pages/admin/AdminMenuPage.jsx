import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { menuCategories } from '../../data/menuData';

function EditModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({ ...item });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputStyle = {
    width: '100%',
    padding: '0.6rem 0.8rem',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.85rem',
    background: 'var(--washi)',
    border: '1px solid var(--washi-dark)',
    borderRadius: 2,
    color: 'var(--ink)',
    outline: 'none',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink)' }}>
            {item.id ? 'Edit Dish' : 'New Dish'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone)' }}><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { label: 'Dish Name', key: 'name', type: 'text' },
            { label: 'Japanese Name', key: 'nameJP', type: 'text' },
            { label: 'Price (RM)', key: 'price', type: 'number' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.4rem' }}>
                {label}
              </label>
              <input
                type={type}
                value={form[key] || ''}
                onChange={e => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.4rem' }}>
              Description
            </label>
            <textarea
              value={form.description || ''}
              onChange={e => set('description', e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.4rem' }}>
              Station
            </label>
            <select
              value={form.station || 'kitchen'}
              onChange={e => set('station', e.target.value)}
              style={inputStyle}
            >
              <option value="kitchen">Kitchen</option>
              <option value="bar">Bar</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.7rem', background: 'var(--washi-warm)', border: '1px solid var(--washi-dark)', borderRadius: 2, fontFamily: 'var(--font-ui)', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--stone)' }}>
            Cancel
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            style={{ flex: 1, padding: '0.7rem', background: 'var(--ink)', border: 'none', borderRadius: 2, fontFamily: 'var(--font-ui)', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Check size={14} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMenuPage() {
  const [categories, setCategories] = useState(menuCategories);
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleSave = (updatedItem) => {
    setCategories(cats => cats.map(cat => ({
      ...cat,
      items: cat.items.map(it => it.id === updatedItem.id ? updatedItem : it),
    })));
  };

  const handleDelete = (itemId) => {
    setCategories(cats => cats.map(cat => ({
      ...cat,
      items: cat.items.filter(it => it.id !== itemId),
    })));
    setDeleteId(null);
  };

  const activeCat = categories.find(c => c.id === activeCategory);

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>
            メニュー管理
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--ink)' }}>
            Menu Management
          </h1>
        </div>
        <button
          onClick={() => setEditing({ id: `new-${Date.now()}`, name: '', nameJP: '', price: 0, description: '', station: 'kitchen' })}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0.65rem 1.25rem',
            background: 'var(--ink)',
            color: 'var(--gold)',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          <Plus size={14} /> Add Dish
        </button>
      </div>

      {/* Category tabs */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: '1px solid var(--washi-dark)',
        marginBottom: '1.75rem',
        overflowX: 'auto',
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '0.75rem 1.25rem',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: activeCategory === cat.id ? 'var(--ink)' : 'var(--stone)',
              background: 'none',
              border: 'none',
              borderBottom: activeCategory === cat.id ? '2px solid var(--gold)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Category info */}
      {activeCat && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--ink)' }}>
              {activeCat.name}
            </h2>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--stone)' }}>
              {activeCat.nameJP}
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--stone-light)' }}>
              ({activeCat.items.length} items)
            </span>
          </div>
        </div>
      )}

      {/* Items table */}
      <div style={{ background: 'var(--washi)', border: '1px solid var(--washi-dark)', borderRadius: 4, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 100px 80px 90px 100px',
          gap: '1rem',
          padding: '0.65rem 1.25rem',
          background: 'var(--washi-warm)',
          borderBottom: '1px solid var(--washi-dark)',
        }}>
          {['Dish', 'Japanese', 'Price', 'Station', 'Actions'].map(h => (
            <span key={h} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone)' }}>
              {h}
            </span>
          ))}
        </div>

        {activeCat?.items.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 100px 80px 90px 100px',
              gap: '1rem',
              padding: '1rem 1.25rem',
              borderBottom: i < activeCat.items.length - 1 ? '1px solid var(--washi-warm)' : 'none',
              alignItems: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--washi-warm)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '0.2rem' }}>{item.name}</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--stone)', lineHeight: 1.4 }}>{item.description.slice(0, 60)}…</p>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--stone)' }}>{item.nameJP}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--gold)' }}>RM {item.price}</span>
            <span style={{
              display: 'inline-block',
              padding: '0.15rem 0.5rem',
              background: item.station === 'bar' ? 'rgba(74,94,58,0.1)' : 'rgba(139,26,26,0.08)',
              color: item.station === 'bar' ? 'var(--sage)' : 'var(--red-lacquer)',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: 2,
              border: `1px solid ${item.station === 'bar' ? 'rgba(74,94,58,0.2)' : 'rgba(139,26,26,0.15)'}`,
              width: 'fit-content',
            }}>
              {item.station}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => setEditing(item)}
                style={{ padding: '0.35rem 0.6rem', background: 'var(--washi-warm)', border: '1px solid var(--washi-dark)', borderRadius: 2, cursor: 'pointer', color: 'var(--stone)', display: 'flex', alignItems: 'center' }}
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => setDeleteId(item.id)}
                style={{ padding: '0.35rem 0.6rem', background: 'rgba(139,26,26,0.07)', border: '1px solid rgba(139,26,26,0.15)', borderRadius: 2, cursor: 'pointer', color: 'var(--red-lacquer)', display: 'flex', alignItems: 'center' }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        {activeCat?.items.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--stone-light)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>No items in this category</p>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && <EditModal item={editing} onClose={() => setEditing(null)} onSave={handleSave} />}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '0.75rem' }}>Remove this dish?</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--stone)', marginBottom: '1.5rem' }}>
              This will remove the item from the menu. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '0.7rem', background: 'var(--washi-warm)', border: '1px solid var(--washi-dark)', borderRadius: 2, fontFamily: 'var(--font-ui)', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--stone)' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: '0.7rem', background: 'var(--red-lacquer)', border: 'none', borderRadius: 2, fontFamily: 'var(--font-ui)', fontSize: '0.75rem', cursor: 'pointer', color: '#fff' }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
