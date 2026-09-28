import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scissors, Laptop, Users, HeartHandshake, GraduationCap, Sprout,
  ArrowRight, Quote, MapPin, ShieldCheck, HandHeart, CheckCircle2,
} from 'lucide-react';
import { useSiteData } from '../context/SiteData';
import { SmartImg } from '../components/PageParts';

const Home = () => {
  const { programs: sitePrograms, stories, galleryItems, impactStats, siteImages } = useSiteData();
  const [searchId, setSearchId] = useState('');
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fallbackAuthorities = [
    { _id: '1', name: 'Bharat Seturiya', designation: 'President', description: 'Leading Kusum Foundation with a vision for empowered rural women and youth.', photoUrl: '/images/team/authority1.png' },
    { _id: '2', name: 'Mohit Mittal', designation: 'Vice President', description: 'Overseeing programs, volunteers, and community outreach across Bihar.', photoUrl: '/images/team/authority2.png' },
    { _id: '3', name: 'Somya Singh', designation: 'Program Coordinator', description: 'Managing vocational training and skill-development workshops.', photoUrl: '/images/team/authority3.png' },
    { _id: '4', name: 'Aruna Roy', designation: 'Team Member', description: 'Dedicated to women empowerment and self-help group programs.', photoUrl: '/images/team/authority4.png' },
    { _id: '5', name: 'Kirti Pallav', designation: 'Team Member', description: 'Focused on education support and adult literacy initiatives.', photoUrl: '/images/team/authority5.png' },
    { _id: '6', name: 'Manav Malhotra', designation: 'Team Member', description: 'Supporting foundation growth and rural community engagement.', photoUrl: '/images/team/authority6.png' },
    { _id: '7', name: 'Dr. Vijay Deshmukh', designation: 'Advisor', description: 'Providing guidance on health, hygiene, and medical assistance drives.', photoUrl: '/images/team/authority7.png' },
    { _id: '8', name: 'Bhavna Mittal', designation: 'Team Member', description: 'Coordinating sewing classes, events, and volunteer activities.', photoUrl: '/images/team/authority8.png' },
    { _id: '9', name: 'Sneha Singh', designation: 'Team Member', description: 'Passionate about youth skill development and self-reliance.', photoUrl: '/images/team/authority9.png' },
  ];
  // __CONTINUE__

  const stats = (impactStats && impactStats.length ? impactStats : [
    { value: '17+', label: 'Years of service' },
    { value: '500+', label: 'Youth trained' },
    { value: '350+', label: 'Women in self-help groups' },
    { value: '3+', label: 'Villages served' },
  ]).slice(0, 4);

  const programs = (sitePrograms || []).slice(0, 6).map((p) => ({
    icon: p.icon,
    title: p.name || p.title,
    desc: p.tagline || p.summary || p.desc,
    slug: p.slug,
  }));

  const galleryPreview = (galleryItems || []).slice(0, 6).map((g) => ({
    src: g.src,
    title: g.title,
    cat: g.category,
  }));

  const testimonials = (stories || []).slice(0, 3).map((s) => ({
    quote: s.quote,
    name: s.name,
    role: [s.role, s.location].filter(Boolean).join(', '),
    image: s.image,
  }));

  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/authorities`);
        if (response.ok) {
          const data = await response.json();
          setAuthorities(data.length > 0 ? data : fallbackAuthorities);
        } else {
          setAuthorities(fallbackAuthorities);
        }
      } catch (error) {
        setAuthorities(fallbackAuthorities);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorities();
  }, []);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    navigate(`/verify/${encodeURIComponent(searchId.trim())}`);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  // __JSX__

  return (
    <div>
      {/* Hero */}
      <section className="relative border-b border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 text-rose-700 px-3 py-1 text-xs font-medium ring-1 ring-rose-100">
                <HandHeart size={14} /> Empowering rural women since 2008
              </span>
              <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight tracking-tight">
                Skills, dignity, and independence for rural Bihar.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                Kusum Foundation works alongside women and youth in Katesar, Saran
                District — with vocational training, self-help groups, education,
                and healthcare that help families stand on their own feet.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-rose-700 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-rose-800 transition">
                  Join as a volunteer <ArrowRight size={16} />
                </Link>
                <Link to="/about" className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-50 transition">
                  Our story
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5"><MapPin size={15} className="text-rose-600" /> Katesar, Saran District, Bihar</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-rose-600" /> Community-led non-profit</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="relative">
              <SmartImg
                src={siteImages?.heroImage || '/images/hero.jpeg'}
                alt="Women and youth of rural Bihar supported by Kusum Foundation"
                seed="kusum-hero-women"
                className="w-full h-80 sm:h-96 object-cover rounded-xl border border-gray-200 shadow-sm"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact stats */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl sm:text-4xl font-semibold text-white">{s.value}</div>
                <div className="mt-2 text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* __JSX2__ */}

      {/* Women empowerment feature */}
      <section className="bg-rose-50/60 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <SmartImg
                src={siteImages?.womenFeatureImage || '/images/women-feature.jpeg'}
                alt="Women in a self-help group meeting"
                seed="kusum-women-feature"
                className="w-full h-72 sm:h-80 object-cover rounded-xl border border-rose-100 shadow-sm"
              />
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-rose-700">Women at the centre</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                When a woman earns, a whole family rises.
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Most of the families we work with depend on a single, uncertain
                income. By helping women learn a trade, save together, and start
                small enterprises, we help households break out of that cycle — on
                their own terms.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Self-help groups with shared savings and micro-loans',
                  'Tailoring, embroidery, and handicraft that sell locally',
                  'Financial and digital literacy for independent decisions',
                  'A community of women who mentor one another',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Link to="/stories" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-rose-700 hover:text-rose-800">
                Read their stories <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-rose-700">What we do</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              Six ways we build self-reliance.
            </h2>
            <p className="mt-3 text-gray-600">
              Every class and every rupee is directed at one thing: helping rural
              families earn, learn, and live with dignity.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="bg-white border border-gray-200 rounded-xl p-6 card-hover">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* __JSX3__ */}

      {/* Gallery preview */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-semibold text-rose-700">From the field</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                Moments from our work.
              </h2>
            </div>
            <Link to="/gallery" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              View gallery <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryPreview.map((g, i) => (
              <motion.div key={g.src || i} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.04 }} className="rounded-xl overflow-hidden border border-gray-200 bg-white card-hover">
                <div className="h-40 sm:h-48 overflow-hidden">
                  <SmartImg src={g.src} alt={g.title} seed={g.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-rose-700">{g.cat}</p>
                  <h3 className="text-sm font-semibold text-gray-900 mt-0.5">{g.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          <Link to="/gallery" className="sm:hidden mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-700">
            View gallery <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold text-rose-700">In their words</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              Change you can hear.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <figure key={t.name} className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col">
                <Quote size={22} className="text-rose-300" />
                <blockquote className="mt-3 text-sm text-gray-700 leading-relaxed flex-1">“{t.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  {t.image && (
                    <SmartImg src={t.image} alt={t.name} seed={t.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      {/* __JSX4__ */}

      {/* Team */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold text-rose-700">Our people</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              The team behind the work.
            </h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-200" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {authorities.map((auth, index) => (
                <motion.div key={auth._id || index} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }} className="bg-white border border-gray-200 rounded-xl p-6 text-center card-hover">
                  <SmartImg
                    src={auth.photoUrl}
                    alt={auth.name}
                    seed={auth.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border border-gray-200"
                  />
                  <h3 className="font-semibold text-gray-900">{auth.name}</h3>
                  <p className="text-sm text-rose-700 mt-0.5">{auth.designation}</p>
                  <p className="mt-3 text-xs text-gray-500 leading-relaxed">{auth.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ways to get involved */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold text-rose-700">Get involved</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              There's a place for you here.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: HandHeart, title: 'Volunteer', desc: 'Give your time and skills to teach, organise, and mentor in our programs.', to: '/register', cta: 'Become a volunteer' },
              { icon: GraduationCap, title: 'Intern', desc: 'Students and graduates can gain real field experience with a verified certificate.', to: '/register', cta: 'Apply for an internship' },
              { icon: Users, title: 'Partner with us', desc: 'Organisations and donors can help us reach more villages and more families.', to: '/about', cta: 'Learn more' },
            ].map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-4"><Icon size={20} /></div>
                  <h3 className="font-semibold text-gray-900 mb-2">{w.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{w.desc}</p>
                  <Link to={w.to} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-rose-700 hover:text-rose-800">{w.cta} <ArrowRight size={15} /></Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Verify */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Verify a certificate</h2>
          <p className="mt-3 text-gray-600">
            Enter a registration number (or scan the QR on a certificate) to
            confirm a volunteer or internship engagement with Kusum Foundation.
          </p>
          <form onSubmit={handleVerify} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input type="text" placeholder="e.g. KF/V/2026/1463" value={searchId} onChange={(e) => setSearchId(e.target.value)} className="flex-1 px-4 py-3 rounded-md bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition" required />
            <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition">Verify</button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-rose-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Ready to make a difference?</h2>
          <p className="mt-3 text-rose-100">Join us as a volunteer or intern and help build a self-reliant rural Bihar.</p>
          <Link to="/register" className="mt-8 inline-flex items-center justify-center gap-2 bg-white text-rose-700 px-6 py-3 rounded-md text-sm font-medium hover:bg-rose-50 transition">
            Get involved <ArrowRight size={16} />
          </Link>
        </div>
      </section>



    </div>
  );
};

export default Home;

