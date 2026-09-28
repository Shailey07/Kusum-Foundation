import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PRIMARY = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/projects', label: 'Projects' },
  { to: '/impact', label: 'Our Impact' },
  { to: '/get-involved', label: 'Get Involved' },
];

const MORE = [
  { to: '/stories', label: 'Success Stories' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/news', label: 'News & Events' },
  { to: '/reports', label: 'Reports & Transparency' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0"
          >
            <img
              src="/images/logo.png"
              alt="Kusum Foundation Logo"
              className="w-11 h-11 sm:w-12 sm:h-12 object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://placehold.co/80x80/6D28D9/FFFFFF?text=KF';
              }}
            />
            <span className="font-poppins font-semibold text-base sm:text-lg text-pink-400 whitespace-nowrap">
              Kusum <span className="text-blue-800">Foundation</span>
            </span>
          </div>
          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-6">
            {PRIMARY.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                {l.label}
              </Link>
            ))}
            <div className="relative group">
              <button className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                More <FaChevronDown size={10} className="mt-0.5" />
              </button>
              <div className="absolute right-0 top-full pt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-150">
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-1.5">
                  {MORE.map((l) => (
                    <Link key={l.to} to={l.to} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-gray-700 hover:text-gray-900 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {[...PRIMARY, ...MORE].map((l) => (
                <Link key={l.to} to={l.to} onClick={toggleMenu} className="block rounded-md px-3 py-2 text-gray-700 text-sm font-medium hover:bg-gray-50 transition">
                  {l.label}
                </Link>
              ))}
              <Link to="/register" onClick={toggleMenu} className="block rounded-md px-3 py-2 bg-gray-900 text-white text-sm font-medium text-center">
                Join Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
