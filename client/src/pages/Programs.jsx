import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSiteData } from '../context/SiteData';
import { PageHero, CTASection, SmartImg, Stat } from '../components/PageParts';

const Programs = () => {
  const { programs, impactStats } = useSiteData();
  return (
  <div className="bg-gray-50">
    <PageHero
      eyebrow="Our Programmes"
      title="Practical programmes that build dignity and self-reliance"
      subtitle="From women’s self-help groups to skill training, education, health, food security and the environment — our work meets rural families where they are and walks with them towards independence."
    />

    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (i % 3) * 0.05 }}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <Link to={`/programs/${p.slug}`}>
                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                  <SmartImg
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-5">
                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ring-1 ${p.color}`}>
                    <Icon size={18} />
                  </span>
                  <h3 className="mt-3 font-semibold text-gray-900">{p.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{p.tagline}</p>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">{p.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-rose-700">
                    Explore programme <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
    {/* Impact band */}
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {impactStats.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
    <CTASection />
  </div>
  );
};

export default Programs;
