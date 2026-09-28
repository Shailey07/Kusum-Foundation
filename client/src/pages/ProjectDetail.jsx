import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, CalendarDays, Wallet, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSiteData } from '../context/SiteData';
import { SmartImg, CTASection, Breadcrumb } from '../components/PageParts';
import { lakh } from './Projects';
import { autoGallery } from '../data/content';

const ProjectDetail = () => {
  const { projects } = useSiteData();
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return <Navigate to="/projects" replace />;

  const others = projects.filter((p) => p.slug !== slug).slice(0, 3);
  // Use the project's own photos; fall back to theme-matched photos when it has
  // none (e.g. added from the admin panel with an empty gallery).
  const gallery = project.gallery && project.gallery.length ? project.gallery : autoGallery(project);
  const facts = [
    { icon: MapPin, label: 'Location', value: project.location },
    { icon: CalendarDays, label: 'Started', value: project.year },
    { icon: Wallet, label: 'Budget', value: lakh(project.budget) },
    { icon: Users, label: 'Beneficiaries', value: project.beneficiaries.toLocaleString('en-IN') },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero image */}
      <section className="relative">
        <div className="aspect-[21/9] max-h-[420px] w-full overflow-hidden bg-gray-200">
          <SmartImg src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
              project.status === 'Running' ? 'bg-green-600 text-white' : 'bg-white text-gray-900'
            }`}>
              {project.status}
            </span>
            <h1 className="mt-3 text-2xl sm:text-4xl font-semibold text-white tracking-tight max-w-3xl">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          trail={[
            { label: 'Home', to: '/' },
            { label: 'Projects', to: '/projects' },
            { label: project.title },
          ]}
        />
        {/* Facts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {facts.map((f) => {
            const FIcon = f.icon;
            return (
              <div key={f.label} className="bg-white border border-gray-200 rounded-xl p-4">
                <FIcon size={17} className="text-rose-600" />
                <div className="mt-2 text-xs text-gray-400">{f.label}</div>
                <div className="text-sm font-semibold text-gray-900 mt-0.5">{f.value}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mt-10">
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-semibold text-gray-900">About this project</h2>
            <p className="text-gray-600 leading-relaxed">{project.summary}</p>

            <h3 className="text-lg font-semibold text-gray-900 pt-3">Highlights</h3>
            <ul className="space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 size={17} className="text-rose-600 mt-0.5 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              {gallery.map((src, i) => (
                <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                  <SmartImg src={src} alt={`${project.title} ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Budget utilisation</h3>
              <div className="flex items-baseline justify-between text-sm mb-1.5">
                <span className="text-gray-500">{lakh(project.spent)} used</span>
                <span className="font-semibold text-gray-900">{project.progress}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full ${project.status === 'Completed' ? 'bg-gray-800' : 'bg-rose-600'}`} style={{ width: `${project.progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-gray-400">Total budget {lakh(project.budget)}</p>
            </div>
          </aside>
        </div>

        {/* Other projects */}
        <div className="mt-14 pt-10 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">More projects</h3>
          <div className="grid sm:grid-cols-3 gap-5">
            {others.map((o) => (
              <Link key={o.slug} to={`/projects/${o.slug}`} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                  <SmartImg src={o.image} alt={o.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 text-sm group-hover:text-rose-700 transition">{o.title}</h4>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-gray-400">{o.location}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default ProjectDetail;
