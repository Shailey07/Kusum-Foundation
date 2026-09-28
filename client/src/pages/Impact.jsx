import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, GraduationCap, MapPin, Home, Wallet, ArrowRight, Quote, FileText,
} from 'lucide-react';
import { useSiteData } from '../context/SiteData';
import { PageHero, CTASection, SmartImg } from '../components/PageParts';

const REACH = [
  { icon: MapPin, value: '12', label: 'Villages reached across Saran' },
  { icon: GraduationCap, value: '8', label: 'Schools engaged' },
  { icon: Users, value: '4,500+', label: 'Individuals directly benefited' },
  { icon: Home, value: '1,200+', label: 'Households supported' },
];

const Impact = () => {
  const { impactHighlights, fundUtilization, stories } = useSiteData();
  // Pull the first couple of real stories through as field voices.
  const VOICES = (stories || []).slice(0, 2).map((s) => ({
    quote: s.quote,
    name: s.name,
    role: s.role,
    img: s.image,
  }));
  return (
  <div className="bg-gray-50">
    <PageHero
      eyebrow="Our Impact"
      title="Change you can count — and see"
      subtitle="Seventeen years of patient, on-the-ground work across rural Bihar. Here is what your support has made possible, and exactly how resources are used."
    />

    {/* Headline numbers */}
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {impactHighlights.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-semibold text-rose-700">{s.value}</div>
              <div className="mt-1 text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
    {/* Reach */}
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Where we work</h2>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {REACH.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-rose-50 text-rose-700">
                <Icon size={19} />
              </span>
              <div className="mt-3 text-2xl font-semibold text-gray-900">{r.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{r.label}</div>
            </div>
          );
        })}
      </div>
    </section>

    {/* Fund utilisation */}
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-rose-600">Transparency</span>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900 tracking-tight">How every ₹100 is used</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            We keep overheads low so that the vast majority of every rupee reaches
            the field. Full audited statements are published on our reports page.
          </p>
          <Link to="/reports" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-rose-700 hover:gap-2 transition-all">
            <FileText size={15} /> View financial reports <ArrowRight size={15} />
          </Link>
        </div>
        <div className="space-y-4">
          {fundUtilization.map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-700">{f.label}</span>
                <span className="font-semibold text-gray-900">{f.pct}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${f.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className={`h-full rounded-full ${f.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Voices */}
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Voices from the field</h2>
        <Link to="/stories" className="text-sm font-medium text-rose-700 inline-flex items-center gap-1 hover:gap-1.5 transition-all">
          All stories <ArrowRight size={15} />
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {VOICES.map((v) => (
          <div key={v.name} className="bg-white border border-gray-200 rounded-xl p-6 flex gap-5">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
              <SmartImg src={v.img} alt={v.name} seed={v.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <Quote size={20} className="text-rose-200" />
              <p className="mt-1 text-gray-700 text-sm leading-relaxed">{v.quote}</p>
              <div className="mt-3 text-sm font-medium text-gray-900">{v.name}</div>
              <div className="text-xs text-gray-500">{v.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
    <CTASection />
  </div>
  );
};

export default Impact;
