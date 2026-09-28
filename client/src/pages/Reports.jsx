import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Download, ShieldCheck, BadgeCheck, Landmark, ScrollText, ArrowRight,
} from 'lucide-react';
import { useSiteData } from '../context/SiteData';
import { PageHero, CTASection } from '../components/PageParts';

const typeColor = {
  Annual: 'bg-rose-50 text-rose-700',
  Financial: 'bg-indigo-50 text-indigo-700',
  Audit: 'bg-amber-50 text-amber-700',
};

const downloadReport = (r, orgInfo) => {
  // Real PDFs live in client/public/reports and are served at r.fileUrl.
  if (r.fileUrl) {
    const a = document.createElement('a');
    a.href = r.fileUrl;
    a.download = r.fileUrl.split('/').pop();
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }
  // Fallback: generate a text summary if no file is attached yet.
  const reg = orgInfo.registration || {};
  const text = [
    `${orgInfo.name}`,
    `${r.title}`,
    `Type: ${r.type} report · ${r.pages} pages`,
    `------------------------------------------`,
    r.summary,
    ``,
    `Registered office: ${orgInfo.address}`,
    `${reg.society || ''}`,
  ].join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${r.title.replace(/[^a-z0-9]+/gi, '-')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const Reports = () => {
  const { reports, orgInfo, fundUtilization } = useSiteData();
  const reg = orgInfo.registration || {};
  const REG = [
    { icon: Landmark, label: 'Society registration', value: reg.society },
    { icon: ScrollText, label: 'PAN', value: reg.pan },
    { icon: BadgeCheck, label: '12A registration', value: reg.reg12A },
    { icon: ShieldCheck, label: '80G (tax exemption)', value: reg.reg80G },
    { icon: BadgeCheck, label: 'NGO Darpan', value: reg.darpan },
  ].filter((r) => r.value);
  return (
  <div className="bg-gray-50">
    <PageHero
      eyebrow="Reports & Transparency"
      title="Open books, by principle"
      subtitle="We believe trust is earned through transparency. Explore our registration details, audited financials and annual reports."
    />

    {/* Registration & compliance */}
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Registration & compliance</h2>
      <p className="mt-2 text-gray-600 max-w-2xl">
        {orgInfo.name} is a registered not-for-profit society. Donations are
        eligible for tax deduction under Section 80G.
      </p>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REG.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <Icon size={18} className="text-rose-600" />
              <div className="mt-2 text-xs text-gray-400 uppercase tracking-wide">{r.label}</div>
              <div className="text-sm font-medium text-gray-900 mt-0.5 break-words">{r.value}</div>
            </div>
          );
        })}
      </div>
    </section>

    {/* Reports list */}
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Downloadable reports</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {reports.map((r, i) => (
            <div key={i} className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="w-11 h-11 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <FileText size={20} className="text-rose-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${typeColor[r.type]}`}>{r.type}</span>
                  <span className="text-[11px] text-gray-400">{r.pages} pages</span>
                </div>
                <h3 className="mt-1 text-sm font-medium text-gray-900 truncate">{r.title}</h3>
              </div>
              <button
                onClick={() => downloadReport(r, orgInfo)}
                title="Download"
                className="p-2.5 rounded-md text-gray-500 hover:bg-white hover:text-rose-700 border border-transparent hover:border-gray-200 transition shrink-0"
              >
                <Download size={17} />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Reports open as PDF documents. Certified hard copies are available on request from the registered office.
        </p>
      </div>
    </section>

    {/* Fund utilisation */}
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">How funds are used</h2>
      <div className="mt-6 grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          {fundUtilization.map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-700">{f.label}</span>
                <span className="font-semibold text-gray-900">{f.pct}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full rounded-full ${f.color}`} style={{ width: `${f.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900">Have a question about our finances?</h3>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            We’re glad to walk any donor or partner through our accounts and
            governance. Reach out and we’ll set up a call.
          </p>
          <Link to="/contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-rose-700 hover:gap-2 transition-all">
            Contact us <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
    <CTASection />
  </div>
  );
};

export default Reports;
