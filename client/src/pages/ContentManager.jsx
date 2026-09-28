import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, X,
} from 'lucide-react';
import { API, authHeader } from '../utils/auth';
import { iconNames } from '../utils/icons';
import { galleryCategories } from '../data/content';
import ImageUpload from '../components/ImageUpload';

const GAL_CATS = (galleryCategories || []).filter((c) => c !== 'All');

// Field schema per content section. Types: text, textarea, number, date,
// select, image, stringlist, imagelist, pairlist.
const SCHEMAS = {
  story: [
    { key: 'name', label: 'Name', type: 'text', req: true },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'image', label: 'Photo', type: 'image' },
    { key: 'quote', label: 'Short quote', type: 'textarea' },
    { key: 'story', label: 'Full story', type: 'textarea' },
  ],
  gallery: [
    { key: 'title', label: 'Title', type: 'text', req: true },
    { key: 'category', label: 'Category', type: 'select', options: GAL_CATS },
    { key: 'src', label: 'Photo', type: 'image' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'date', label: 'Date (e.g. Jan 2026)', type: 'text' },
  ],
  news: [
    { key: 'title', label: 'Headline', type: 'text', req: true },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'tag', label: 'Tag', type: 'text' },
    { key: 'image', label: 'Image', type: 'image' },
    { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
  ],
  event: [
    { key: 'title', label: 'Event title', type: 'text', req: true },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'place', label: 'Place', type: 'text' },
    { key: 'type', label: 'Type', type: 'text' },
  ],
  press: [
    { key: 'title', label: 'Headline', type: 'text', req: true },
    { key: 'outlet', label: 'Publication', type: 'text' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'url', label: 'Article URL', type: 'text' },
  ],
  report: [
    { key: 'title', label: 'Report title', type: 'text', req: true },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'type', label: 'Type', type: 'select', options: ['Annual', 'Financial', 'Audit', 'Other'] },
    { key: 'pages', label: 'Pages', type: 'number' },
    { key: 'summary', label: 'Summary', type: 'textarea' },
    { key: 'fileUrl', label: 'File URL (PDF link)', type: 'text' },
  ],
  // __SCHEMAS2__
  program: [
    { key: 'name', label: 'Program name', type: 'text', req: true },
    { key: 'slug', label: 'Slug (used in the URL)', type: 'text', req: true },
    { key: 'iconName', label: 'Icon', type: 'select', options: iconNames },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    { key: 'summary', label: 'Summary', type: 'textarea' },
    { key: 'image', label: 'Cover photo', type: 'image' },
    { key: 'whatWeDo', label: 'What we do (one paragraph per row)', type: 'stringlist' },
    { key: 'activities', label: 'Activities', type: 'stringlist' },
    { key: 'impact', label: 'Impact stats (number + label)', type: 'pairlist' },
    { key: 'gallery', label: 'Gallery photos', type: 'imagelist' },
  ],
  project: [
    { key: 'title', label: 'Project title', type: 'text', req: true },
    { key: 'slug', label: 'Slug (used in the URL)', type: 'text', req: true },
    { key: 'status', label: 'Status', type: 'select', options: ['Running', 'Completed'] },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'budget', label: 'Budget (₹)', type: 'number' },
    { key: 'spent', label: 'Spent so far (₹)', type: 'number' },
    { key: 'progress', label: 'Progress (%)', type: 'number' },
    { key: 'beneficiaries', label: 'Beneficiaries', type: 'number' },
    { key: 'image', label: 'Cover photo', type: 'image' },
    { key: 'summary', label: 'Summary', type: 'textarea' },
    { key: 'highlights', label: 'Highlights', type: 'stringlist' },
    { key: 'gallery', label: 'Gallery photos', type: 'imagelist' },
  ],
};

// __FIELDS__

const SECTIONS = [
  { key: 'story', label: 'Stories', title: (d) => d.name },
  { key: 'gallery', label: 'Gallery', title: (d) => d.title },
  { key: 'program', label: 'Programs', title: (d) => d.name },
  { key: 'project', label: 'Projects', title: (d) => d.title },
  { key: 'news', label: 'News', title: (d) => d.title },
  { key: 'event', label: 'Events', title: (d) => d.title },
  { key: 'press', label: 'Press', title: (d) => d.title },
  { key: 'report', label: 'Reports', title: (d) => d.title },
];

// Editable list of plain strings (paragraphs, activities…) or images.
const StringListField = ({ value, onChange, image }) => {
  const arr = Array.isArray(value) ? value : [];
  const set = (i, v) => onChange(arr.map((x, idx) => (idx === i ? v : x)));
  const add = () => onChange([...arr, '']);
  const remove = (i) => onChange(arr.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {arr.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          {image ? (
            <div className="flex-1"><ImageUpload label="" value={item} onChange={(v) => set(i, v)} /></div>
          ) : (
            <textarea
              rows={2}
              value={item}
              onChange={(e) => set(i, e.target.value)}
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          )}
          <button type="button" onClick={() => remove(i)} className="p-2 rounded-md text-red-500 hover:bg-red-50 shrink-0">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1.5 text-sm text-rose-700 font-medium hover:text-rose-800">
        <Plus size={14} /> Add {image ? 'photo' : 'item'}
      </button>
    </div>
  );
};

// __FIELDS2__

// Editable list of {value, label} rows, used for program impact stats.
const PairListField = ({ value, onChange }) => {
  const arr = Array.isArray(value) ? value : [];
  const set = (i, k, v) => onChange(arr.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));
  const add = () => onChange([...arr, { value: '', label: '' }]);
  const remove = (i) => onChange(arr.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {arr.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            value={item.value || ''}
            onChange={(e) => set(i, 'value', e.target.value)}
            placeholder="350+"
            className="w-28 px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900"
          />
          <input
            value={item.label || ''}
            onChange={(e) => set(i, 'label', e.target.value)}
            placeholder="Women in self-help groups"
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900"
          />
          <button type="button" onClick={() => remove(i)} className="p-2 rounded-md text-red-500 hover:bg-red-50 shrink-0">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1.5 text-sm text-rose-700 font-medium hover:text-rose-800">
        <Plus size={14} /> Add stat
      </button>
    </div>
  );
};

// Renders a single schema field bound to form[field.key].
const Field = ({ field, value, onChange }) => {
  const base = 'w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900';
  const full = ['textarea', 'stringlist', 'imagelist', 'pairlist', 'image'].includes(field.type);
  if (field.type === 'image') {
    return (
      <div className="sm:col-span-2">
        <ImageUpload label={field.label} value={value || ''} onChange={onChange} />
      </div>
    );
  }
  // __FIELD_CONTROL__
  let control;
  switch (field.type) {
    case 'textarea':
      control = <textarea rows={3} value={value || ''} onChange={(e) => onChange(e.target.value)} className={base} />;
      break;
    case 'number':
      control = (
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className={base}
        />
      );
      break;
    case 'date':
      control = <input type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} className={base} />;
      break;
    case 'select':
      control = (
        <select value={value || ''} onChange={(e) => onChange(e.target.value)} className={`${base} bg-white`}>
          <option value="">Select…</option>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
      break;
    case 'stringlist':
      control = <StringListField value={value} onChange={onChange} />;
      break;
    case 'imagelist':
      control = <StringListField value={value} onChange={onChange} image />;
      break;
    case 'pairlist':
      control = <PairListField value={value} onChange={onChange} />;
      break;
    default:
      control = <input value={value || ''} onChange={(e) => onChange(e.target.value)} className={base} />;
  }
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {field.label}{field.req && ' *'}
      </label>
      {control}
    </div>
  );
};

const ContentManager = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState({});
  const [section, setSection] = useState('story');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const flash = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/content?all=1`, { headers: authHeader() });
      if (res.ok) setGroups(await res.json());
      else if (res.status === 401 || res.status === 403) setError('Please log in as an admin to manage content.');
      else setError('Could not load content.');
    } catch {
      setError('Could not reach the server.');
    }
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  const items = groups[section] || [];
  const schema = SCHEMAS[section] || [];
  const meta = SECTIONS.find((s) => s.key === section);

  const openCreate = () => { setEditing(null); setForm({}); setError(''); setModal(true); };
  const openEdit = (it) => {
    const { _id, order, active, ...data } = it;
    setEditing(it); setForm(data); setError(''); setModal(true);
  };

  // __MAIN3__
  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const url = editing ? `${API}/content/${editing._id}` : `${API}/content`;
      const method = editing ? 'PUT' : 'POST';
      const body = editing
        ? { data: form }
        : { section, data: form, order: items.length, active: true };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(body),
      });
      const out = await res.json();
      if (res.ok) { setModal(false); flash(editing ? 'Changes saved' : 'Item added'); fetchAll(); }
      else setError(out.message || 'Could not save.');
    } catch {
      setError('Server error. Please try again.');
    }
    setSaving(false);
  };

  const remove = async (it) => {
    if (!window.confirm('Delete this item permanently?')) return;
    const res = await fetch(`${API}/content/${it._id}`, { method: 'DELETE', headers: authHeader() });
    if (res.ok) { flash('Deleted'); fetchAll(); } else flash('Could not delete', 'error');
  };

  const toggle = async (it) => {
    const res = await fetch(`${API}/content/${it._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ active: !it.active }),
    });
    if (res.ok) { flash(it.active ? 'Hidden from site' : 'Now visible'); fetchAll(); }
    else flash('Could not update', 'error');
  };

  const move = async (it, dir) => {
    const idx = items.findIndex((x) => x._id === it._id);
    const j = dir === 'up' ? idx - 1 : idx + 1;
    if (j < 0 || j >= items.length) return;
    const other = items[j];
    await Promise.all([
      fetch(`${API}/content/${it._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify({ order: other.order }) }),
      fetch(`${API}/content/${other._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify({ order: it.order }) }),
    ]);
    fetchAll();
  };

  // __MAIN4__
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition mb-5"
        >
          <ArrowLeft size={15} /> Back to dashboard
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Content Manager</h1>
            <p className="mt-1 text-sm text-gray-500">
              Add, edit, hide, reorder or delete the content that appears across the public site.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-rose-700 text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-rose-800 transition"
          >
            <Plus size={16} /> Add {meta?.label?.replace(/s$/, '') || 'item'}
          </button>
        </div>

        {/* Section tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                section === s.key ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s.label}
              <span className={`ml-1.5 ${section === s.key ? 'text-gray-300' : 'text-gray-400'}`}>
                {(groups[s.key] || []).length}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 bg-red-50 text-red-700 border border-red-100 p-3 rounded-md text-sm">{error}</div>
        )}

        {/* Items */}
        <div className="mt-6 space-y-2">
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">Loading…</div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
              Nothing here yet. Click “Add” to create the first one.
            </div>
          ) : (
            items.map((it, i) => {
              const thumb = it.image || it.src;
              return (
                <div key={it._id} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3">
                  <div className="flex flex-col">
                    <button disabled={i === 0} onClick={() => move(it, 'up')} className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30"><ChevronUp size={15} /></button>
                    <button disabled={i === items.length - 1} onClick={() => move(it, 'down')} className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30"><ChevronDown size={15} /></button>
                  </div>
                  <div className="w-14 h-14 shrink-0 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                    {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] text-gray-400">No image</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 text-sm truncate">{meta?.title(it) || 'Untitled'}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {[it.role, it.category, it.status, it.tag, it.type, it.outlet, it.location, it.date].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  {!it.active && <span className="text-[11px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 shrink-0">Hidden</span>}
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggle(it)} title={it.active ? 'Hide' : 'Show'} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                      {it.active ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button onClick={() => openEdit(it)} title="Edit" className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"><Pencil size={15} /></button>
                    <button onClick={() => remove(it)} title="Delete" className="p-2 rounded-md text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* __MODAL__ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="text-base font-semibold text-gray-900">
                {editing ? 'Edit' : 'Add'} {meta?.label?.replace(/s$/, '')}
              </h3>
              <button onClick={() => setModal(false)} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={save} className="px-6 py-5">
              {error && (
                <div className="mb-4 bg-red-50 text-red-700 border border-red-100 p-2.5 rounded-md text-sm">{error}</div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                {schema.map((field) => (
                  <Field
                    key={field.key}
                    field={field}
                    value={form[field.key]}
                    onChange={(v) => setForm((f) => ({ ...f, [field.key]: v }))}
                  />
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 pt-5 mt-4 border-t border-gray-100">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-md bg-rose-700 text-white text-sm font-medium hover:bg-rose-800 transition disabled:opacity-60">
                  {saving ? 'Saving…' : editing ? 'Save changes' : 'Add item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-md text-sm text-white shadow-lg ${toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ContentManager;
