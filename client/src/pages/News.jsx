import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Newspaper, ArrowUpRight } from 'lucide-react';
import { useSiteData } from '../context/SiteData';
import { PageHero, CTASection, SmartImg } from '../components/PageParts';

const fmt = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const tagColor = {
  Announcement: 'bg-rose-50 text-rose-700',
  Milestone: 'bg-green-50 text-green-700',
  Event: 'bg-indigo-50 text-indigo-700',
  Environment: 'bg-emerald-50 text-emerald-700',
};

const News = () => {
  const { news, events, press } = useSiteData();
  return (
  <div className="bg-gray-50">
    <PageHero
      eyebrow="News & Events"
      title="What’s happening at Kusum Foundation"
      subtitle="Latest updates from the field, upcoming events you can join, and our work in the press."
    />

    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-10">
      {/* Latest news */}
      <div className="lg:col-span-2">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Latest updates</h2>
        <div className="space-y-5">
          {news.map((n, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (i % 4) * 0.04 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition sm:flex"
            >
              {n.image && (
                <div className="sm:w-48 shrink-0 h-40 sm:h-auto overflow-hidden bg-gray-100">
                  <SmartImg
                    src={n.image}
                    alt={n.title}
                    seed={n.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs">
                  <span className={`rounded-full px-2.5 py-0.5 font-medium ${tagColor[n.tag] || 'bg-gray-100 text-gray-600'}`}>{n.tag}</span>
                  <span className="text-gray-400">{fmt(n.date)}</span>
                </div>
                <h3 className="mt-2.5 font-semibold text-gray-900">{n.title}</h3>
                <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{n.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      {/* Sidebar */}
      <aside className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-rose-600" /> Upcoming events
          </h2>
          <div className="space-y-3">
            {events.map((e, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4">
                <div className="text-center shrink-0 w-12">
                  <div className="text-lg font-semibold text-rose-700 leading-none">
                    {new Date(e.date).getDate()}
                  </div>
                  <div className="text-[11px] uppercase text-gray-400 mt-0.5">
                    {new Date(e.date).toLocaleDateString('en-IN', { month: 'short' })}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{e.type}</span>
                  <h3 className="text-sm font-medium text-gray-900 leading-snug">{e.title}</h3>
                  <p className="mt-0.5 text-xs text-gray-500 inline-flex items-center gap-1">
                    <MapPin size={11} /> {e.place}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Newspaper size={18} className="text-rose-600" /> In the press
          </h2>
          <div className="space-y-3">
            {press.map((p, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-900">{p.outlet}</span>
                  <span className="text-[11px] text-gray-400">{fmt(p.date)}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 leading-snug flex items-start gap-1">
                  {p.title} <ArrowUpRight size={13} className="text-gray-300 mt-0.5 shrink-0" />
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
    <CTASection />
  </div>
  );
};

export default News;
