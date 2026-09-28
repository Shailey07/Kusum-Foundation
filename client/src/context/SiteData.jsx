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

// The API groups content by section: { story:[], gallery:[], program:[], ... }
const buildContent = (grouped = {}) => ({
  stories: pick(grouped.story, fallback.stories),
  galleryItems: pick(grouped.gallery, fallback.galleryItems),
  programs: withIcons(pick(grouped.program, fallback.programs)),
  projects: pick(grouped.project, fallback.projects),
  news: pick(grouped.news, fallback.news),
  events: pick(grouped.event, fallback.events),
  press: pick(grouped.press, fallback.press),
  reports: pick(grouped.report, fallback.reports),
});

// The settings singleton: objects merge shallow, arrays fall back when empty.
const buildSettings = (s = {}) => ({
  orgInfo: { ...fallback.orgInfo, ...(s.orgInfo || {}) },
  socials: { ...fallback.socials, ...(s.socials || {}) },
  siteImages: { ...fallback.siteImages, ...(s.siteImages || {}) },
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

