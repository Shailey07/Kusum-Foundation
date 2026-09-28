import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { useSiteData } from '../context/SiteData';

const QUICK = [
  { to: '/about', label: 'About us' },
  { to: '/programs', label: 'Programs' },
  { to: '/projects', label: 'Projects' },
  { to: '/impact', label: 'Our impact' },
  { to: '/get-involved', label: 'Get involved' },
  { to: '/reports', label: 'Reports & transparency' },
];

const SOCIAL_ICONS = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
};

const Footer = () => {
  const { orgInfo = {}, socials = {} } = useSiteData();

  const address = orgInfo.address || 'Katesar, Saran District, Bihar, India';
  const phone = orgInfo.phone || '+91 7419921792';
  const email = orgInfo.email || 'kusumfoundationinfo@gmail.com';

  const socialLinks = Object.entries(SOCIAL_ICONS)
    .filter(([key]) => socials && socials[key])
    .map(([key, Icon]) => ({ key, Icon, href: socials[key] }));

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <img
                src="/images/logo.png"
                alt={orgInfo.name || 'Kusum Foundation'}
                className="w-12 h-12 object-contain bg-white rounded-full p-1"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://placehold.co/80x80/FFFFFF/6D28D9?text=KF';
                }}
              />
              <h3 className="font-poppins font-semibold text-lg text-white">
                {orgInfo.name || 'Kusum Foundation'}
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-6">
              {orgInfo.tagline ||
                'Working since 2008 in rural Bihar on vocational training, women empowerment, education support, and community welfare — helping families build a life of dignity and self-reliance.'}
            </p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-poppins font-semibold text-sm text-white uppercase tracking-wider mb-4">
              Quick links
            </h4>
            <ul className="space-y-2 text-sm">
              {QUICK.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-poppins font-semibold text-sm text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{address}</li>
              <li>{phone}</li>
              <li className="break-all">{email}</li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-poppins font-semibold text-sm text-white uppercase tracking-wider mb-4">
              Follow
            </h4>
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks.length ? (
                socialLinks.map(({ key, Icon, href }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white transition"
                    aria-label={key}
                  >
                    <Icon size={20} />
                  </a>
                ))
              ) : (
                <span className="text-xs text-gray-600">Follow us soon.</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {orgInfo.name || 'Kusum Foundation'} · Estd. 2008 · All
            rights reserved.
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Registered under the Societies Registration Act, 1860 · Donations eligible for tax benefit under 80G.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;