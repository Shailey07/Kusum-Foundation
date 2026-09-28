import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { API, authHeader } from '../utils/auth';
import ImageUpload from '../components/ImageUpload';

// A card wrapper for a group of settings.
const Card = ({ title, desc, children }) => (
  <section className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
    <h2 className="text-base font-semibold text-gray-900">{title}</h2>
    {desc && <p className="text-xs text-gray-500 mt-0.5 mb-4">{desc}</p>}
    <div className={desc ? '' : 'mt-4'}>{children}</div>
  </section>
);

const inputCls =
  'w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900';

// Generic editor for an array of flat objects (impact stats, causes, fund rows…).
const ObjectRows = ({ items, onChange, fields, template, addLabel = 'Add' }) => {
  const arr = Array.isArray(items) ? items : [];
  const set = (i, k, v) => onChange(arr.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));
  const add = () => onChange([...arr, { ...template }]);
  const remove = (i) => onChange(arr.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {arr.map((row, i) => (
        <div key={i} className="flex flex-wrap gap-2 items-center">
          {fields.map((f) => (
            <input
              key={f.key}
              type={f.type === 'number' ? 'number' : 'text'}
              value={row[f.key] ?? ''}
              onChange={(e) =>
                set(i, f.key, f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)
              }
              placeholder={f.placeholder}
              className={`${f.grow ? 'flex-1 min-w-[140px]' : ''} ${f.w || ''} px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900`}
            />
          ))}
          <button type="button" onClick={() => remove(i)} className="p-2 rounded-md text-red-500 hover:bg-red-50 shrink-0">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1.5 text-sm text-rose-700 font-medium hover:text-rose-800">
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
};

const SiteSettings = () => {
  const navigate = useNavigate();
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const flash = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/settings`);
        if (res.ok) {
          const s = await res.json();
          setD({
            orgInfo: { registration: {}, ...(s.orgInfo || {}) },
            socials: s.socials || {},
            siteImages: s.siteImages || {},
            impactStats: s.impactStats || [],
            impactHighlights: s.impactHighlights || [],
            fundUtilization: s.fundUtilization || [],
            causes: s.causes || [],
            donationPresets: s.donationPresets || { 'one-time': [], monthly: [] },
          });
        } else setError('Could not load settings.');
      } catch {
        setError('Could not reach the server.');
      }
      setLoading(false);
    })();
  }, []);

  const org = (k, v) => setD((p) => ({ ...p, orgInfo: { ...p.orgInfo, [k]: v } }));
  const reg = (k, v) => setD((p) => ({ ...p, orgInfo: { ...p.orgInfo, registration: { ...(p.orgInfo.registration || {}), [k]: v } } }));
  const soc = (k, v) => setD((p) => ({ ...p, socials: { ...p.socials, [k]: v } }));
  const simg = (k, v) => setD((p) => ({ ...p, siteImages: { ...p.siteImages, [k]: v } }));
  const field = (k, v) => setD((p) => ({ ...p, [k]: v }));
  const preset = (k, text) =>
    setD((p) => ({
      ...p,
      donationPresets: { ...p.donationPresets, [k]: text.split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n) && n > 0) },
    }));

  const save = async () => {
    setSaving(true); setError('');
    try {
      const res = await fetch(`${API}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(d),
      });
      const out = await res.json();
      if (res.ok) flash('Settings saved');
      else setError(out.message || 'Could not save settings.');
    } catch {
      setError('Server error. Please try again.');
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 text-sm">Loading…</div>;
  if (!d) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600 text-sm">{error || 'Could not load settings.'}</div>;

  const reginfo = d.orgInfo.registration || {};

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <button onClick={() => navigate('/admin/dashboard')} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition mb-5">
          <ArrowLeft size={15} /> Back to dashboard
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Site Settings</h1>
            <p className="mt-1 text-sm text-gray-500">Contact details, photos, social links, impact numbers and donation options shown across the site.</p>
          </div>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-rose-700 text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-rose-800 transition disabled:opacity-60">
            <Save size={16} /> {saving ? 'Saving…' : 'Save all changes'}
          </button>
        </div>

        {error && <div className="mb-4 bg-red-50 text-red-700 border border-red-100 p-3 rounded-md text-sm">{error}</div>}

        <div className="space-y-5">
          <Card title="Organisation info" desc="Shown in the footer, on the contact page and across the site.">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input value={d.orgInfo.name ?? ''} onChange={(e) => org('name', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Established</label>
                <input value={d.orgInfo.estd ?? ''} onChange={(e) => org('estd', e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Tagline</label>
                <textarea rows={2} value={d.orgInfo.tagline ?? ''} onChange={(e) => org('tagline', e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                <input value={d.orgInfo.address ?? ''} onChange={(e) => org('address', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                <input value={d.orgInfo.phone ?? ''} onChange={(e) => org('phone', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input value={d.orgInfo.email ?? ''} onChange={(e) => org('email', e.target.value)} className={inputCls} />
              </div>
            </div>
          </Card>
          <Card title="Registration & compliance" desc="Legal registration numbers shown on the reports and transparency pages.">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Society registration</label>
                <input value={reginfo.society ?? ''} onChange={(e) => reg('society', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">PAN</label>
                <input value={reginfo.pan ?? ''} onChange={(e) => reg('pan', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">12A registration</label>
                <input value={reginfo.reg12A ?? ''} onChange={(e) => reg('reg12A', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">80G registration</label>
                <input value={reginfo.reg80G ?? ''} onChange={(e) => reg('reg80G', e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">NGO Darpan ID</label>
                <input value={reginfo.darpan ?? ''} onChange={(e) => reg('darpan', e.target.value)} className={inputCls} />
              </div>
            </div>
          </Card>
          <Card title="Social links" desc="Shown as icons in the footer. Leave a field blank to hide that icon.">
            <div className="grid sm:grid-cols-2 gap-3">
              {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'].map((k) => (
                <div key={k}>
                  <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{k}</label>
                  <input value={d.socials[k] ?? ''} onChange={(e) => soc(k, e.target.value)} placeholder={`https://${k}.com/…`} className={inputCls} />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Home & About photos" desc="The main photos on the Home and About pages. Upload your own photo (or paste an image link). Leave a field blank to keep the default photo from the site's images folder.">
            <div className="space-y-4">
              <ImageUpload
                label="Home — hero photo (top of the home page)"
                value={d.siteImages.heroImage ?? ''}
                onChange={(v) => simg('heroImage', v)}
              />
              <ImageUpload
                label='Home — "When a woman earns…" photo'
                value={d.siteImages.womenFeatureImage ?? ''}
                onChange={(v) => simg('womenFeatureImage', v)}
              />
              <ImageUpload
                label='About — "How it began" photo'
                value={d.siteImages.aboutStoryImage ?? ''}
                onChange={(v) => simg('aboutStoryImage', v)}
              />
              <ImageUpload
                label='About — "Why women first" photo'
                value={d.siteImages.aboutWomenImage ?? ''}
                onChange={(v) => simg('aboutWomenImage', v)}
              />
            </div>
          </Card>

          <Card title="Impact stats" desc="Headline numbers shown on the home and impact pages.">
            <ObjectRows
              items={d.impactStats}
              onChange={(v) => field('impactStats', v)}
              template={{ value: '', label: '' }}
              addLabel="Add stat"
              fields={[
                { key: 'value', placeholder: 'e.g. 12,000+', w: 'w-40' },
                { key: 'label', placeholder: 'e.g. Lives impacted', grow: true },
              ]}
            />
          </Card>
          <Card title="Impact highlights" desc="Secondary achievements listed on the impact page.">
            <ObjectRows
              items={d.impactHighlights}
              onChange={(v) => field('impactHighlights', v)}
              template={{ value: '', label: '' }}
              addLabel="Add highlight"
              fields={[
                { key: 'value', placeholder: 'e.g. 40+', w: 'w-40' },
                { key: 'label', placeholder: 'e.g. Villages reached', grow: true },
              ]}
            />
          </Card>

          <Card title="Fund utilization" desc="How donations are used — shown as a breakdown on the reports page. Percentages should add up to 100.">
            <ObjectRows
              items={d.fundUtilization}
              onChange={(v) => field('fundUtilization', v)}
              template={{ label: '', pct: '', color: '' }}
              addLabel="Add category"
              fields={[
                { key: 'label', placeholder: 'e.g. Programs', grow: true },
                { key: 'pct', placeholder: '%', type: 'number', w: 'w-24' },
                { key: 'color', placeholder: '#hex or class', w: 'w-40' },
              ]}
            />
          </Card>
          <Card title="Donation causes" desc="Causes a donor can choose to give towards on the donate page.">
            <ObjectRows
              items={d.causes}
              onChange={(v) => field('causes', v)}
              template={{ id: '', label: '', desc: '' }}
              addLabel="Add cause"
              fields={[
                { key: 'id', placeholder: 'id (e.g. education)', w: 'w-44' },
                { key: 'label', placeholder: 'Label', grow: true },
                { key: 'desc', placeholder: 'Short description', grow: true },
              ]}
            />
          </Card>

          <Card title="Donation amounts" desc="Preset amounts (in ₹) offered on the donate page. Separate values with commas.">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">One-time amounts</label>
                <input
                  defaultValue={(d.donationPresets['one-time'] || []).join(', ')}
                  onChange={(e) => preset('one-time', e.target.value)}
                  placeholder="500, 1000, 2500, 5000"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Monthly amounts</label>
                <input
                  defaultValue={(d.donationPresets.monthly || []).join(', ')}
                  onChange={(e) => preset('monthly', e.target.value)}
                  placeholder="300, 600, 1200"
                  className={inputCls}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-rose-700 text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-rose-800 transition disabled:opacity-60">
            <Save size={16} /> {saving ? 'Saving…' : 'Save all changes'}
          </button>
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-md text-sm text-white shadow-lg ${toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};



export default SiteSettings;
