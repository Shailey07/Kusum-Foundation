import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, ShieldCheck } from 'lucide-react';
import { API, setUserInfo, dashboardPath } from '../utils/auth';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserInfo({ token: data.token, user: data.user });
        navigate(dashboardPath(data.user?.role));
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    }
    setLoading(false);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-gray-200">
          <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
            <LogIn size={22} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Sign in to your portal</h2>
          <p className="text-sm text-gray-500 mt-1">
            Volunteers, donors, partners, staff and admins — one login for all.
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email or username
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-700 text-white py-3 rounded-md font-medium text-sm hover:bg-rose-800 transition disabled:opacity-70"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            New here?{' '}
            <Link to="/register" className="text-rose-700 font-medium hover:underline">
              Create an account
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-4">
            <ShieldCheck size={13} /> Secure, role-based access
          </div>
          <div className="text-center mt-4">
            <Link to="/" className="text-xs text-gray-500 hover:text-gray-900 transition">
              ← Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
