import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Users } from 'lucide-react';
import { useSiteData } from '../context/SiteData';
import { PageHero, CTASection, SmartImg } from '../components/PageParts';

export const lakh = (n) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L` : `₹${n.toLocaleString('en-IN')}`;

const FILTERS = ['All', 'Running', 'Completed'];

const Projects = () => {
  const { projects } = useSiteData();
  const [filter, setFilter] = useState('All');
  const shown = projects.filter((p) => filter === 'All' || p.status === filter);

  return (
    <div className="bg-gray-50">
      <PageHero
        eyebrow="Our Projects"
        title="On-the-ground projects, with the numbers to match"
        subtitle="Each project has a place, a budget and a measurable goal. We publish what we set out to do, how far along we are, and who it reaches."
      />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === f
                  ? 'bg-rose-700 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {shown.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (i % 2) * 0.05 }}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition flex flex-col"
            >
              <Link to={`/projects/${p.slug}`} className="flex flex-col h-full">
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <SmartImg src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    p.status === 'Running'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-900/80 text-white'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1"><MapPin size={13} /> {p.location}</span>
                    <span className="inline-flex items-center gap-1"><Users size={13} /> {p.beneficiaries.toLocaleString('en-IN')} reached</span>
                  </div>
                  <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-rose-700 transition">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-600 leading-relaxed line-clamp-2">{p.summary}</p>

                  <div className="mt-4 pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>{lakh(p.spent)} of {lakh(p.budget)} used</span>
                      <span className="font-medium text-gray-700">{p.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${p.status === 'Completed' ? 'bg-gray-800' : 'bg-rose-600'}`}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-rose-700">
                      View project <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default Projects;
