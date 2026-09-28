import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2,
  Facebook, Instagram, Twitter, Youtube, Linkedin,
} from 'lucide-react';
import { useSiteData } from '../context/SiteData';
import { PageHero } from '../components/PageParts';

const MAP_SRC =
  'https://www.google.com/maps?q=' +
  encodeURIComponent('Katesar, Saran District, Bihar 841301, India') +
  '&output=embed';

const SOCIAL_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

const Contact = () => {
  const { orgInfo, socials } = useSiteData();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [step, setStep] = useState('form'); // form | sending | done

  const DETAILS = [
    { icon: MapPin, label: 'Visit us', value: orgInfo.address },
    { icon: Phone, label: 'Call us', value: orgInfo.phone, href: `tel:${(orgInfo.phone || '').replace(/\s/g, '')}` },
    { icon: Mail, label: 'Email us', value: orgInfo.email, href: `mailto:${orgInfo.email}` },
    { icon: Clock, label: 'Office hours', value: 'Mon–Sat, 9:30 am – 5:30 pm IST' },
  ];

  const SOCIALS = Object.entries(SOCIAL_ICONS)
    .filter(([k]) => socials && socials[k])
    .map(([k, Icon]) => ({ icon: Icon, label: k, href: socials[k] }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStep('sending');
    // Demo only — simulate delivering the message. Nothing is actually sent.
    setTimeout(() => setStep('done'), 1400);
  };

  const field = (k) => ({
    value: form[k],
    onChange: (e) => setForm({ ...form, [k]: e.target.value }),
  });

  return (
    <div className="bg-gray-50">
      <PageHero
        eyebrow="Contact"
        title="We’d love to hear from you"
        subtitle="Questions about our work, partnerships, volunteering or donations — send us a note and our team will get back to you."
      />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-5 gap-8">
        {/* Form / confirmation */}
        <div className="lg:col-span-3">
          {step === 'done' ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={30} />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Message sent — thank you!</h2>
              <p className="mt-2 text-gray-600 text-sm max-w-md mx-auto">
                Thanks, {form.name || 'friend'}. We’ve received your message and will
                reply to {form.email || 'your email'} shortly.
              </p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
                This is a demonstration — no message was actually delivered.
              </p>
              <div className="mt-6">
                <button onClick={() => { setForm({ name: '', email: '', phone: '', subject: '', message: '' }); setStep('form'); }}
                  className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition">
                  Send another message
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">Send us a message</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
                  <input required {...field('name')} className="w-full px-3 py-2.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" {...field('email')} className="w-full px-3 py-2.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input {...field('phone')} className="w-full px-3 py-2.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input {...field('subject')} className="w-full px-3 py-2.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea required rows={5} {...field('message')} className="w-full px-3 py-2.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600" />
              </div>
              <button type="submit" disabled={step === 'sending'}
                className="inline-flex items-center justify-center gap-2 bg-rose-700 text-white px-6 py-3 rounded-md font-semibold text-sm hover:bg-rose-800 transition disabled:opacity-70">
                {step === 'sending' ? (<><Loader2 size={16} className="animate-spin" /> Sending…</>) : (<><Send size={16} /> Send message</>)}
              </button>
              <p className="text-xs text-gray-400">Demo form — your message is not actually transmitted.</p>
            </form>
          )}
        </div>
        <aside className="lg:col-span-2 space-y-4">
          {DETAILS.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.label} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-rose-50 text-rose-700 shrink-0">
                  <Icon size={19} />
                </span>
                <div className="min-w-0">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">{d.label}</div>
                  {d.href ? (
                    <a href={d.href} className="text-sm font-medium text-gray-900 hover:text-rose-700 break-words">{d.value}</a>
                  ) : (
                    <div className="text-sm font-medium text-gray-900 break-words">{d.value}</div>
                  )}
                </div>
              </div>
            );
          })}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Follow us</div>
            <div className="mt-3 flex gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-rose-700 hover:border-rose-200 transition capitalize">
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>
        </aside>
      </section>
      {/* Map */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
          <iframe title="Kusum Foundation location" src={MAP_SRC}
            className="w-full h-80" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>
    </div>
  );
};

export default Contact;
