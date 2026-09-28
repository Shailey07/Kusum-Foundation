import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSiteData } from '../context/SiteData';
import { SmartImg, CTASection, Breadcrumb, Stat } from '../components/PageParts';
import { autoGallery } from '../data/content';

const ProgramDetail = () => {
  const { programs } = useSiteData();
  const { slug } = useParams();
  const program = programs.find((p) => p.slug === slug);
  if (!program) return <Navigate to="/programs" replace />;

  const Icon = program.icon;
  const others = programs.filter((p) => p.slug !== slug).slice(0, 3);
  // Show the programme's own photos; if it carries none (e.g. added from the
  // admin panel with an empty gallery), fall back to theme-matched photos so
  // "From the field" is never empty.
  const gallery = program.gallery && program.gallery.length ? program.gallery : autoGallery(program);

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <Breadcrumb
            trail={[
              { label: 'Home', to: '/' },
              { label: 'Programmes', to: '/programs' },
              { label: program.name },
            ]}
          />
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className={`inline-flex items-center justify-center w-11 h-11 rounded-lg ring-1 ${program.color}`}>
                <Icon size={22} />
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
                {program.name}
              </h1>
              <p className="mt-3 text-lg text-rose-700 font-medium">{program.tagline}</p>
              <p className="mt-4 text-gray-600 leading-relaxed">{program.summary}</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="aspect-[16/11] rounded-2xl overflow-hidden bg-gray-100 shadow-sm"
            >
              <SmartImg src={program.image} alt={program.name} className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>
      {/* Body */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-semibold text-gray-900">What we do</h2>
            {program.whatWeDo.map((para, i) => (
              <p key={i} className="text-gray-600 leading-relaxed">{para}</p>
            ))}

            <h3 className="text-lg font-semibold text-gray-900 pt-4">Key activities</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {program.activities.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 size={17} className="text-rose-600 mt-0.5 shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Impact so far</h3>
              <div className="space-y-4">
                {program.impact.map((m) => (
                  <div key={m.label} className="flex items-baseline justify-between border-b border-gray-100 pb-3 last:border-0">
                    <span className="text-2xl font-semibold text-rose-700">{m.value}</span>
                    <span className="text-sm text-gray-500 text-right">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Gallery */}
        <div className="mt-14">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">From the field</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.map((src, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                <SmartImg src={src} alt={`${program.name} ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        {/* Other programmes */}
        <div className="mt-14 pt-10 border-t border-gray-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Other programmes</h3>
            <Link to="/programs" className="text-sm font-medium text-rose-700 inline-flex items-center gap-1 hover:gap-1.5 transition-all">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {others.map((o) => {
              const OIcon = o.icon;
              return (
                <Link
                  key={o.slug}
                  to={`/programs/${o.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                >
                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ring-1 ${o.color}`}>
                    <OIcon size={17} />
                  </span>
                  <h4 className="mt-3 font-medium text-gray-900 group-hover:text-rose-700 transition">{o.name}</h4>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{o.tagline}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default ProgramDetail;
