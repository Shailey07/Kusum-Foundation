import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Quote, ArrowRight } from 'lucide-react';
import { useSiteData } from '../context/SiteData';
import { SmartImg } from '../components/PageParts';

const Stories = () => {
  const { stories } = useSiteData();

  const fadeIn = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-sm font-semibold text-rose-700">Voices from the village</p>
          <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight max-w-3xl">
            Stories of women and youth who changed their own lives.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            Every skill learned, every rupee earned, and every child kept in school begins
            with one decision to try. These are a few of the people we have walked alongside
            in Katesar and across Saran District.
          </p>
        </div>
      </section>

      {/* Stories */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16 sm:space-y-20">
          {stories.map((s, i) => (
            <motion.div
              key={s._id || i}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid md:grid-cols-5 gap-8 items-center"
            >
              <div className={`md:col-span-2 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                <SmartImg
                  src={s.image}
                  alt={s.name}
                  seed={s.name}
                  className="w-full h-64 sm:h-72 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
              </div>
              <div className={`md:col-span-3 ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                <Quote size={28} className="text-rose-300" />
                <blockquote className="mt-3 text-xl sm:text-2xl font-medium text-gray-900 leading-relaxed">
                  “{s.quote}”
                </blockquote>
                <p className="mt-4 text-gray-600 leading-relaxed">{s.story}</p>
                <div className="mt-5">
                  <div className="font-semibold text-gray-900">{s.name}</div>
                  <div className="text-sm text-rose-700">{s.role} · {s.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact band */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Youth trained in skills' },
              { value: '350+', label: 'Women in self-help groups' },
              { value: '1,200+', label: 'Families reached' },
              { value: '17+', label: 'Years serving rural Bihar' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl sm:text-4xl font-semibold text-white">{s.value}</div>
                <div className="mt-2 text-xs sm:text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            Your story could be the next one.
          </h2>
          <p className="mt-3 text-gray-600">
            Join as a volunteer or intern, or support a woman's first step toward independence.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 bg-rose-700 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-rose-800 transition">
              Get involved <ArrowRight size={16} />
            </Link>
            <Link to="/gallery" className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-50 transition">
              See our gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stories;
