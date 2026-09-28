import React, { useRef, useState } from 'react';
import { Upload, Loader2, ImageIcon, X } from 'lucide-react';
import { API, authHeader } from '../utils/auth';

// A small image field: paste/enter a URL, or upload a file (which is sent to the
// server as a base64 data URL and stored, returning a hotlinkable URL). Used
// across the admin CMS so staff can add the NGO's own photos.
const ImageUpload = ({ value = '', onChange, label = 'Image' }) => {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErr('Please choose an image file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErr('Image too large (max 8MB).');
      return;
    }
    setErr('');
    setBusy(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ dataUrl }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setErr(data.message || 'Upload failed.');
      }
    } catch {
      setErr('Upload failed. Please try again.');
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 shrink-0 rounded-md border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
          {value ? (
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={18} className="text-gray-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-2">
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste an image URL, or upload →"
              className="flex-1 min-w-0 px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 whitespace-nowrap"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {busy ? 'Uploading…' : 'Upload'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                title="Clear"
                className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={15} />
              </button>
            )}
          </div>
          {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
};

export default ImageUpload;
