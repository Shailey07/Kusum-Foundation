import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Target, Eye, Heart, Users, ShieldCheck, Sprout, MapPin, Quote,
  Scissors, Laptop, GraduationCap, HeartHandshake, ArrowRight,
} from 'lucide-react';
import { useSiteData } from '../context/SiteData';

const IMG_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23D66A2E'/%3E%3Cstop offset='1' stop-color='%23A83B1A'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3C/svg%3E";

const values = [
  { icon: Heart, title: 'Dignity first', desc: 'We offer a hand up, not a handout — every program protects the dignity of the people we serve.' },
  { icon: Users, title: 'Community-led', desc: 'Villagers decide what they need. We listen, then build programs around their priorities.' },
  { icon: Sprout, title: 'Women at the centre', desc: 'When women earn and lead, whole families and villages move forward. They come first.' },
  { icon: ShieldCheck, title: 'Transparency', desc: 'Every certificate we issue can be publicly verified, and our work is open to those we serve.' },
];

const milestones = [
  { year: '2008', title: 'Kusum Foundation is born', desc: 'A small group of volunteers begins adult-literacy classes in Katesar, Saran District.' },
  { year: '2011', title: 'First tailoring centre', desc: 'Sewing and embroidery training opens a first path to home-based income for women.' },
  { year: '2014', title: 'Self-help groups form', desc: 'Women organise into savings circles, pooling money and starting micro-enterprises.' },
  { year: '2017', title: 'Digital literacy arrives', desc: 'Basic computer courses help rural youth qualify for their first jobs.' },
  { year: '2020', title: 'Relief in hard times', desc: 'Food, hygiene, and medical support reach families through the pandemic.' },
  { year: '2023', title: 'Scholarships & mentoring', desc: 'Study materials and scholarships keep more girls in school.' },
  { year: '2026', title: 'Verified certificates', desc: 'Every volunteer and intern engagement is now confirmable by QR verification.' },
];

const programs = [
  { icon: Scissors, title: 'Vocational Training', desc: 'Sewing, embroidery, and handicraft courses that turn a skill into a steady income.' },
  { icon: Laptop, title: 'Digital Literacy', desc: 'Computer basics and digital skills that open the door to jobs for rural youth.' },
  { icon: Users, title: 'Women Empowerment', desc: 'Self-help groups, savings, and livelihood support led by the women themselves.' },
  { icon: GraduationCap, title: 'Education Support', desc: 'Scholarships, study material, and adult literacy for children and mothers.' },
  { icon: HeartHandshake, title: 'Community Welfare', desc: 'Medical camps, hygiene drives, and relief for families in need.' },
  { icon: Sprout, title: 'Sustainable Livelihoods', desc: 'Kitchen gardens, micro-enterprise, and financial literacy for lasting independence.' },
];
// __CONTINUE__

const About = () => {
  const { siteImages } = useSiteData();
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 text-rose-700 px-3 py-1 text-xs font-medium ring-1 ring-rose-100">
            <MapPin size={14} /> Katesar, Saran District, Bihar
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight max-w-3xl">
            A rural foundation, built on trust since 2008.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            Kusum Foundation works with women, children, and youth in rural Bihar —
            through vocational training, women's self-help groups, education support,
            and community welfare. Our goal is simple: help families build a life of
            dignity and self-reliance, together.
          </p>
        </div>
      </section>

      {/* Founding story */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <img
              src={siteImages?.aboutStoryImage || '/images/about-story.svg'}
              alt="Kusum Foundation's work in rural Bihar"
              className="w-full h-72 sm:h-80 object-cover rounded-xl border border-gray-200 shadow-sm"
              onError={(e) => { e.target.onerror = null; e.target.src = IMG_FALLBACK; }}
            />
            <div>
              <p className="text-sm font-semibold text-rose-700">How it began</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                From a single literacy class to a movement.
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Kusum Foundation started in 2008 with a handful of volunteers and one
                borrowed room, teaching women and children in Katesar to read and write.
                We soon saw that literacy alone was not enough — families needed an income
                they could count on.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                So we began teaching skills: first sewing, then embroidery, computers, and
                more. Women organised into self-help groups, saved together, and started
                small businesses. Nearly two decades on, that same idea still guides us —
                real skills, led by the community, for lasting change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's note */}
      <section className="bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Quote size={32} className="text-rose-400" />
          <blockquote className="mt-4 text-xl sm:text-2xl font-medium text-white leading-relaxed">
            “We never wanted to simply give things away. We wanted every mother and every
            young person here to earn their own living and hold their head high. That is
            what dignity means to us.”
          </blockquote>
          <div className="mt-6">
            <div className="text-sm font-semibold text-white">Bharat Seturiya</div>
            <div className="text-sm text-gray-400">Founder &amp; Director, Kusum Foundation</div>
          </div>
        </div>
      </section>
      {/* __JSX2__ */}

      {/* Mission & Vision */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-4"><Target size={22} /></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Our mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To equip rural women and youth with practical, income-generating skills,
                support children's education, and stand with families in need — through
                community-driven, sustainable programs.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-4"><Eye size={22} /></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Our vision</h2>
              <p className="text-gray-600 leading-relaxed">
                A rural society where every woman and child has access to skills, education,
                and healthcare — and the confidence to shape their own future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold text-rose-700">What we stand for</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">The values behind every program.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-gray-50 border border-gray-200 rounded-xl p-6 card-hover">
                  <div className="w-10 h-10 rounded-lg bg-white text-rose-700 border border-rose-100 flex items-center justify-center mb-4"><Icon size={20} /></div>
                  <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Women focus */}
      <section className="bg-rose-50/60 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-semibold text-rose-700">Why women first</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                Empowered women change everything around them.
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                In the villages we serve, a woman's income is rarely just her own — it pays
                school fees, buys medicine, and feeds the household. When we invest in women,
                the return reaches every corner of the family.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                That is why women lead most of our programs: as trainers, as self-help group
                heads, and as mentors to the next batch of learners. Empowerment here is not
                a slogan — it is a role women hold.
              </p>
            </div>
            <img
              src={siteImages?.aboutWomenImage || '/images/women-feature.svg'}
              alt="Women's self-help group"
              className="order-1 lg:order-2 w-full h-72 sm:h-80 object-cover rounded-xl border border-rose-100 shadow-sm"
              onError={(e) => { e.target.onerror = null; e.target.src = IMG_FALLBACK; }}
            />
          </div>
        </div>
      </section>
      {/* __JSX3__ */}

      {/* Timeline */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-10">
            <p className="text-sm font-semibold text-rose-700">Our journey</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Milestones along the way.</h2>
          </div>
          <ol className="relative border-l border-gray-200 ml-3">
            {milestones.map((m) => (
              <li key={m.year} className="mb-9 ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-rose-600 ring-4 ring-white" />
                <div className="text-sm font-semibold text-rose-700">{m.year}</div>
                <h3 className="mt-1 font-semibold text-gray-900">{m.title}</h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{m.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold text-rose-700">What we do</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Six programs, one mission.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="bg-white border border-gray-200 rounded-xl p-6 card-hover">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-4"><Icon size={20} /></div>
                  <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverage + stats */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-4 gap-8 items-center">
            <div className="lg:col-span-1">
              <div className="inline-flex items-center gap-2 text-rose-400 text-sm font-semibold"><MapPin size={16} /> Where we work</div>
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                Rooted in Katesar and reaching villages across Saran District, Bihar —
                with plans to grow, one community at a time.
              </p>
            </div>
            <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { value: '17+', label: 'Years of service' },
                { value: '500+', label: 'Youth trained' },
                { value: '350+', label: 'Women in SHGs' },
                { value: '3+', label: 'Villages served' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl sm:text-4xl font-semibold text-white">{s.value}</div>
                  <div className="mt-2 text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Be part of the next chapter.</h2>
          <p className="mt-3 text-gray-600">Volunteer, intern, or partner with us to reach more families across rural Bihar.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 bg-rose-700 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-rose-800 transition">Get involved <ArrowRight size={16} /></Link>
            <Link to="/stories" className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-50 transition">Read our stories</Link>
          </div>
        </div>
      </section>


    </div>
  );
};

export default About;

