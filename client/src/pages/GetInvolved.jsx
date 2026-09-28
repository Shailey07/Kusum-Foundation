import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HandHeart, Megaphone, Building2, BadgeCheck, ArrowRight,
} from 'lucide-react';
import { PageHero, CTASection } from '../components/PageParts';

const WAYS = [
  {
    icon: HandHeart,
    title: 'Volunteer with us',
    color: 'bg-rose-50 text-rose-700 ring-rose-100',
    desc: 'Teach a class, help at a health camp, or lend a professional skill. Volunteers are the heart of everything we do — give a few hours a week or join a one-day drive.',
    cta: 'Register as a volunteer',
    to: '/register',
  },
  {
    icon: Megaphone,
    title: 'Start a fundraiser',
    color: 'bg-amber-50 text-amber-700 ring-amber-100',
    desc: 'Turn a birthday, wedding or festival into a force for good. Rally friends and family around a cause you care about and we’ll help you set it up.',
    cta: 'Talk to us',
    to: '/contact',
  },
  {
    icon: Building2,
    title: 'Corporate & CSR partnership',
    color: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    desc: 'Partner your company’s CSR with measurable rural impact. We offer project proposals, transparent reporting and employee-engagement opportunities.',
    cta: 'Explore partnership',
    to: '/contact',
  },
  {
    icon: BadgeCheck,
    title: 'Become a member',
    color: 'bg-sky-50 text-sky-700 ring-sky-100',
    desc: 'Join the foundation as a member to stay close to our work, vote at general meetings, and help shape the direction of our programmes.',
    cta: 'Apply for membership',
    to: '/register',
  },
];
const STEPS = [
  { n: '1', title: 'Choose how you’d like to help', desc: 'Volunteer, fundraise or partner — pick what fits you.' },
  { n: '2', title: 'Register or reach out', desc: 'Create an account or send us a message; our team gets in touch.' },
  { n: '3', title: 'Get onboarded', desc: 'We match you to a programme, event or project that needs you.' },
  { n: '4', title: 'See your impact', desc: 'Track hours, receipts and outcomes from your portal.' },
];

const GetInvolved = () => (
  <div className="bg-gray-50">
    <PageHero
      eyebrow="Get Involved"
      title="There’s a place for you at Kusum Foundation"
      subtitle="Time, money, skills or a network — whatever you can give, we’ll put it to work for rural families in Bihar. Here’s how you can join in."
    />

    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WAYS.map((w, i) => {
          const Icon = w.icon;
          return (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (i % 3) * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col hover:shadow-md transition"
            >
              <span className={`inline-flex items-center justify-center w-11 h-11 rounded-lg ring-1 ${w.color}`}>
                <Icon size={22} />
              </span>
              <h3 className="mt-4 font-semibold text-gray-900">{w.title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">{w.desc}</p>
              <Link
                to={w.to}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-rose-700 hover:gap-2 transition-all"
              >
                {w.cta} <ArrowRight size={15} />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>

    {/* How it works */}
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight text-center">How it works</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="relative">
              <div className="w-10 h-10 rounded-full bg-rose-700 text-white flex items-center justify-center font-semibold">
                {s.n}
              </div>
              <h3 className="mt-4 font-medium text-gray-900">{s.title}</h3>
              <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <CTASection title="Ready to make a difference?" subtitle="Join hundreds of volunteers and supporters already changing lives across rural Bihar." />
  </div>
);

export default GetInvolved;
