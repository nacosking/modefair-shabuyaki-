import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { adminMenuApi } from '../../api/apiClient';
import { PageLoader, PageError } from '../../components/PageState';

function EditModal({ item, categories, onClose, onSave }) {
  const [form, setForm] = useState(item ? { ...item, categoryId: item.categoryId, routingStation: item.routingStation } : { name:'', nameJp:'', description:'', price:'', routingStation:'kitchen', categoryId: categories[0]?.id || '' });
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleSave = async () => {
    setSaving(true); setErr('');
    try {
      await onSave({ ...form, price: Number(form.price), categoryId: Number(form.categoryId) });
      onClose();
    } catch (e) { setErr(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const inputStyle = { width:'100%', padding:'0.6rem 0.8rem', fontFamily:'var(--font-ui)', fontSize:'0.85rem', background:'var(--washi)', border:'1px solid var(--washi-dark)', borderRadius:2, color:'var(--ink)', outline:'none' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:400, color:'var(--ink)' }}>{item ? 'Edit Dish' : 'New Dish'}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--stone)' }}><X size={18} /></button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {[['Dish Name','name','text'],['Japanese Name','nameJp','text'],['Price (RM)','price','number']].map(([label,key,type]) => (
            <div key={key}>
              <label style={{ display:'block', fontFamily:'var(--font-ui)', fontSize:'0.68rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--stone)', marginBottom:'0.4rem' }}>{label}</label>
              <input type={type} value={form[key]||''} onChange={e => set(key, e.target.value)} style={inputStyle} />
            </div>
          ))}
          <div>
            <label style={{ display:'block', fontFamily:'var(--font-ui)', fontSize:'0.68rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--stone)', marginBottom:'0.4rem' }}>Description</label>
            <textarea value={form.description||''} onChange={e => set('description', e.target.value)} rows={3} style={{ ...inputStyle, resize:'vertical', lineHeight:1.6 }} />
          </div>
          <div>
            <label style={{ display:'block', fontFamily:'var(--font-ui)', fontSize:'0.68rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--stone)', marginBottom:'0.4rem' }}>Category</label>
            <select value={form.categoryId||''} onChange={e => set('categoryId', e.target.value)} style={inputStyle}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:'block', fontFamily:'var(--font-ui)', fontSize:'0.68rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--stone)', marginBottom:'0.4rem' }}>Station</label>
            <select value={form.routingStation||'kitchen'} onChange={e => set('routingStation', e.target.value)} style={inputStyle}>
              <option value="kitchen">Kitchen</option>
              <option value="bar">Bar</option>
            </select>
          </div>
        </div>
        {err && <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', color:'var(--red-lacquer)', marginTop:'0.75rem' }}>{err}</p>}
        <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.5rem' }}>
          <button onClick={onClose} style={{ flex:1, padding:'0.7rem', background:'var(--washi-warm)', border:'1px solid var(--washi-dark)', borderRadius:2, fontFamily:'var(--font-ui)', fontSize:'0.75rem', cursor:'pointer', color:'var(--stone)' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex:1, padding:'0.7rem', background:'var(--ink)', border:'none', borderRadius:2, fontFamily:'var(--font-ui)', fontSize:'0.75rem', cursor:saving?'not-allowed':'pointer', color:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', gap:6, opacity:saving?0.7:1 }}>
            <Check size={14} />{saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [itemsRes, catsRes] = await Promise.all([adminMenuApi.getAll(), adminMenuApi.getCategories()]);
      setItems(itemsRes.data.data || []);
      const cats = catsRes.data.data || [];
      setCategories(cats);
      if (cats.length > 0 && !activeCategory) setActiveCategory(cats[0].id);
    } catch { setError('Could not load menu data. Please retry.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSave = async (form) => {
    if (isNew) {
      const { data } = await adminMenuApi.create(form);
      setItems(prev => [...prev, data.data]);
    } else {
      const { data } = await adminMenuApi.update(editing.id, form);
      setItems(prev => prev.map(i => i.id === editing.id ? data.data : i));
    }
    setEditing(null); setIsNew(false);
  };

  const handleDelete = async (id) => {
    await adminMenuApi.softDelete(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, isActive: false } : i));
    setDeleteId(null);
  };

  const handleRestore = async (id) => {
    const { data } = await adminMenuApi.restore(id);
    setItems(prev => prev.map(i => i.id === id ? data.data : i));
  };

  if (loading) return <PageLoader label="Loading menu..." />;
  if (error)   return <PageError message={error} onRetry={fetchAll} />;

  const catItems = items.filter(i => i.categoryId === activeCategory);
  const activeCat = categories.find(c => c.id === activeCategory);

  return (
    <div className="page-enter">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.3rem' }}>メニュー管理</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:400, color:'var(--ink)' }}>Menu Management</h1>
        </div>
        <button onClick={() => { setIsNew(true); setEditing({}); }} style={{ display:'flex', alignItems:'center', gap:8, padding:'0.65rem 1.25rem', background:'var(--ink)', color:'var(--gold)', fontFamily:'var(--font-ui)', fontSize:'0.75rem', letterSpacing:'0.1em', textTransform:'uppercase', border:'none', borderRadius:2, cursor:'pointer' }}>
          <Plus size={14} /> Add Dish
        </button>
      </div>

      <div style={{ display:'flex', borderBottom:'1px solid var(--washi-dark)', marginBottom:'1.75rem', overflowX:'auto' }}>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            style={{ padding:'0.75rem 1.25rem', fontFamily:'var(--font-ui)', fontSize:'0.72rem', letterSpacing:'0.1em', textTransform:'uppercase', color: activeCategory===cat.id ? 'var(--ink)' : 'var(--stone)', background:'none', border:'none', borderBottom: activeCategory===cat.id ? '2px solid var(--gold)' : '2px solid transparent', cursor:'pointer', whiteSpace:'nowrap' }}>
            {cat.name}
          </button>
        ))}
      </div>

      {activeCat && (
        <div style={{ display:'flex', alignItems:'baseline', gap:'0.6rem', marginBottom:'1.5rem' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:400, color:'var(--ink)' }}>{activeCat.name}</h2>
          <span style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:'1rem', color:'var(--stone)' }}>{activeCat.nameJp}</span>
          <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', color:'var(--stone-light)' }}>({catItems.length} items)</span>
        </div>
      )}

      <div style={{ background:'var(--washi)', border:'1px solid var(--washi-dark)', borderRadius:4, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 80px 90px 120px', gap:'1rem', padding:'0.65rem 1.25rem', background:'var(--washi-warm)', borderBottom:'1px solid var(--washi-dark)' }}>
          {['Dish','Japanese','Price','Station','Actions'].map(h => (
            <span key={h} style={{ fontFamily:'var(--font-ui)', fontSize:'0.62rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--stone)' }}>{h}</span>
          ))}
        </div>

        {catItems.map((item, i) => (
          <div key={item.id}
            style={{ display:'grid', gridTemplateColumns:'1fr 100px 80px 90px 120px', gap:'1rem', padding:'1rem 1.25rem', borderBottom: i < catItems.length-1 ? '1px solid var(--washi-warm)' : 'none', alignItems:'center', opacity: item.isActive ? 1 : 0.5 }}
            onMouseEnter={e => e.currentTarget.style.background='var(--washi-warm)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <div>
              <p style={{ fontFamily:'var(--font-body)', fontSize:'0.9rem', color:'var(--ink)', marginBottom:'0.15rem' }}>
                {item.name} {!item.isActive && <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.65rem', color:'var(--stone-light)', marginLeft:4 }}>(inactive)</span>}
              </p>
              <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', color:'var(--stone)' }}>{(item.description||'').slice(0,55)}...</p>
            </div>
            <span style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:'0.85rem', color:'var(--stone)' }}>{item.nameJp}</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1rem', color:'var(--gold)' }}>RM {Number(item.price).toFixed(2)}</span>
            <span style={{ display:'inline-block', padding:'0.15rem 0.5rem', background: item.routingStation==='bar' ? 'rgba(74,94,58,0.1)' : 'rgba(139,26,26,0.08)', color: item.routingStation==='bar' ? 'var(--sage)' : 'var(--red-lacquer)', fontFamily:'var(--font-ui)', fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:2, width:'fit-content' }}>
              {item.routingStation}
            </span>
            <div style={{ display:'flex', gap:'0.4rem' }}>
              <button onClick={() => { setEditing(item); setIsNew(false); }} style={{ padding:'0.35rem 0.6rem', background:'var(--washi-warm)', border:'1px solid var(--washi-dark)', borderRadius:2, cursor:'pointer', color:'var(--stone)', display:'flex', alignItems:'center' }}><Pencil size={13} /></button>
              {item.isActive ? (
                <button onClick={() => setDeleteId(item.id)} style={{ padding:'0.35rem 0.6rem', background:'rgba(139,26,26,0.07)', border:'1px solid rgba(139,26,26,0.15)', borderRadius:2, cursor:'pointer', color:'var(--red-lacquer)', display:'flex', alignItems:'center' }}><Trash2 size={13} /></button>
              ) : (
                <button onClick={() => handleRestore(item.id)} style={{ padding:'0.35rem 0.6rem', background:'rgba(74,94,58,0.08)', border:'1px solid rgba(74,94,58,0.2)', borderRadius:2, cursor:'pointer', color:'var(--sage)', fontFamily:'var(--font-ui)', fontSize:'0.65rem' }}>Restore</button>
              )}
            </div>
          </div>
        ))}
        {catItems.length === 0 && (
          <div style={{ padding:'2rem', textAlign:'center', color:'var(--stone-light)' }}>
            <p style={{ fontFamily:'var(--font-body)', fontStyle:'italic' }}>No items in this category</p>
          </div>
        )}
      </div>

      {editing !== null && (
        <EditModal item={isNew ? null : editing} categories={categories} onClose={() => { setEditing(null); setIsNew(false); }} onSave={handleSave} />
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:400, color:'var(--ink)', marginBottom:'0.75rem' }}>Deactivate this dish?</h3>
            <p style={{ fontFamily:'var(--font-body)', fontSize:'0.85rem', color:'var(--stone)', marginBottom:'1.5rem' }}>The item will be hidden from the menu but preserved in order history.</p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={() => setDeleteId(null)} style={{ flex:1, padding:'0.7rem', background:'var(--washi-warm)', border:'1px solid var(--washi-dark)', borderRadius:2, fontFamily:'var(--font-ui)', fontSize:'0.75rem', cursor:'pointer', color:'var(--stone)' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex:1, padding:'0.7rem', background:'var(--red-lacquer)', border:'none', borderRadius:2, fontFamily:'var(--font-ui)', fontSize:'0.75rem', cursor:'pointer', color:'#fff' }}>Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
