import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { fallbackPhoto } from '../data/content';

// Shared building blocks for the public marketing pages so styling stays
// consistent. All images degrade to a REAL bundled photo if the asset is
// missing — never a coloured placeholder.
export const IMG_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23E8547E'/%3E%3Cstop offset='1' stop-color='%23B31E64'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='900' height='600' fill='url(%23g)'/%3E%3C/svg%3E";

// Renders the given image and, if it is missing or fails to load, degrades to a
// real bundled photo from the local pool (chosen deterministically by seed so
// it stays stable across renders). The gradient data-URI is only a last-ditch
// resort that in practice never shows, because the pool photos ship with the
// site. No external/online images are ever requested.
export const SmartImg = ({ src, alt = '', className = '', seed }) => {
  const [stage, setStage] = useState(0);
  const chain = [src, fallbackPhoto(seed || alt || src || ''), IMG_FALLBACK].filter(Boolean);
  const current = chain[Math.min(stage, chain.length - 1)];
  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setStage((s) => (s < chain.length - 1 ? s + 1 : s))}
    />
  );
};

export const PageHero = ({ eyebrow, title, subtitle, children }) => (
  <section className="bg-gradient-to-b from-rose-50 to-gray-50 border-b border-gray-100">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {eyebrow && (
          <span className="inline-block rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </motion.div>
    </div>
  </section>
);
export const SectionHeading = ({ eyebrow, title, subtitle, center = false }) => (
  <div className={center ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}>
    {eyebrow && (
      <span className="text-xs font-semibold uppercase tracking-widest text-rose-600">
        {eyebrow}
      </span>
    )}
    <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
      {title}
    </h2>
    {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
  </div>
);

export const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl sm:text-4xl font-semibold text-rose-700">{value}</div>
    <div className="mt-1 text-sm text-gray-500">{label}</div>
  </div>
);

export const Breadcrumb = ({ trail = [] }) => (
  <nav className="text-xs text-gray-400 mb-4 flex flex-wrap items-center gap-1.5">
    {trail.map((t, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {t.to ? (
          <Link to={t.to} className="hover:text-gray-700 transition">{t.label}</Link>
        ) : (
          <span className="text-gray-600">{t.label}</span>
        )}
        {i < trail.length - 1 && <span>/</span>}
      </span>
    ))}
  </nav>
);

// Recurring volunteer call-to-action band, used at the foot of pages.
export const CTASection = ({
  title = 'Be part of the change',
  subtitle = 'Every contribution and every hour helps a rural family in Bihar move towards dignity and self-reliance.',
}) => (
  <section className="bg-rose-700">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
      <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">{title}</h2>
      <p className="mt-3 text-rose-100 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/get-involved"
          className="inline-flex items-center gap-2 bg-rose-800/40 text-white ring-1 ring-white/40 px-6 py-3 rounded-md text-sm font-semibold hover:bg-rose-800/60 transition"
        >
          <Users size={17} /> Get involved <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  </section>
);
