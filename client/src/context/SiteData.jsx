import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { API } from '../utils/auth';
import { getIcon } from '../utils/icons';
import * as fallback from '../data/content';

// Runtime site content. Every public page reads through useSiteData() so that
// whatever the main admin edits in the CMS appears live. Until the API responds
// (or if it is unreachable) we serve the static fallback bundled in
// data/content.js, so the site is never empty and always shows real photos.

const SiteDataContext = createContext(null);

// Use the API array when it actually has items, otherwise the static fallback.
const pick = (apiArr, fb) =>
  Array.isArray(apiArr) && apiArr.length ? apiArr : fb;

// Programs are stored with an `iconName` string (a lucide component can't live
// in the database); resolve it back to a real component so cards show an icon.
const withIcons = (programs) =>
  (programs || []).map((p) => ({ ...p, icon: getIcon(p.iconName) }));

// Force every image reference — whether it came from the API/database or the
// static fallback — to a bundled local photo. CMS records saved earlier may
// still carry old online URLs (loremflickr / randomuser / picsum) or /uploads/
// paths that are wiped on the host and 404 in the browser; rewriting them here
// guarantees the public site never renders a broken or online image.
const seedOf = (it) =>
  it.title || it.name || it.slug || it.category || it._id || '';
const fixImages = (it, portrait = false) => {
  if (!it || typeof it !== 'object') return it;
  const one = portrait ? fallback.localPortrait : fallback.localImage;
  const seed = seedOf(it);
  const out = { ...it };
  if ('image' in out) out.image = one(out.image, seed);
  if ('src' in out) out.src = one(out.src, seed);
  if ('avatar' in out) out.avatar = fallback.localPortrait(out.avatar, seed);
  if (Array.isArray(out.gallery)) {
    out.gallery = out.gallery.map((g, i) =>
      typeof g === 'string' ? fallback.localImage(g, `${seed}|g${i}`) : g);
  }
  return out;
};
const cleanList = (arr, portrait = false) =>
  (arr || []).map((x) => fixImages(x, portrait));

// Named site images (hero, about, etc.) — keep bundled paths, rewrite any
// online/uploads override coming from the settings singleton.
const cleanImages = (obj = {}) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) =>
      [k, typeof v === 'string' ? fallback.localImage(v, k) : v]),
  );

// The API groups content by section: { story:[], gallery:[], program:[], ... }
const buildContent = (grouped = {}) => ({
  stories: cleanList(pick(grouped.story, fallback.stories), true),
  galleryItems: cleanList(pick(grouped.gallery, fallback.galleryItems)),
  programs: withIcons(cleanList(pick(grouped.program, fallback.programs))),
  projects: cleanList(pick(grouped.project, fallback.projects)),
  news: cleanList(pick(grouped.news, fallback.news)),
  events: cleanList(pick(grouped.event, fallback.events)),
  press: cleanList(pick(grouped.press, fallback.press)),
  reports: pick(grouped.report, fallback.reports),
});

// The settings singleton: objects merge shallow, arrays fall back when empty.
const buildSettings = (s = {}) => ({
  orgInfo: { ...fallback.orgInfo, ...(s.orgInfo || {}) },
  socials: { ...fallback.socials, ...(s.socials || {}) },
  siteImages: cleanImages({ ...fallback.siteImages, ...(s.siteImages || {}) }),
  impactStats: pick(s.impactStats, fallback.impactStats),
  impactHighlights: pick(s.impactHighlights, fallback.impactHighlights),
  fundUtilization: pick(s.fundUtilization, fallback.fundUtilization),
  causes: pick(s.causes, fallback.causes),
  donationPresets:
    s.donationPresets && Object.keys(s.donationPresets).length
      ? s.donationPresets
      : fallback.donationPresets,
});

// The initial (offline) snapshot, shown until the API responds.
const STATIC = {
  ...buildContent({}),
  ...buildSettings({}),
  galleryCategories: fallback.galleryCategories,
  loading: true,
};

export const SiteDataProvider = ({ children }) => {
  const [data, setData] = useState(STATIC);

  const load = async () => {
    try {
      const [cRes, sRes] = await Promise.all([
        fetch(`${API}/content`),
        fetch(`${API}/settings`),
      ]);
      const grouped = cRes.ok ? await cRes.json() : {};
      const settings = sRes.ok ? await sRes.json() : {};
      setData({
        ...buildContent(grouped),
        ...buildSettings(settings),
        galleryCategories: fallback.galleryCategories,
        loading: false,
      });
    } catch {
      // Network/API unavailable — keep the static fallback, just stop loading.
      setData((d) => ({ ...d, loading: false }));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const value = useMemo(() => ({ ...data, refresh: load }), [data]);
  return (
    <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
  );
};

// Pages call this. If used outside the provider it still returns static content.
export const useSiteData = () => {
  const ctx = useContext(SiteDataContext);
  return ctx || { ...STATIC, loading: false, refresh: () => {} };
};

