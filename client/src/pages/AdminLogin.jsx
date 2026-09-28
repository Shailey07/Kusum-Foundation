import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API, setUserInfo, dashboardPath } from '../utils/auth';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: username, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserInfo({ token: data.token, user: data.user });
        navigate(dashboardPath(data.user?.role));
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server connection failed');
    }
    setIsLoading(false);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <div className="p-8 border-b border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
            Admin
          </p>
          <h2 className="text-xl font-semibold text-gray-900">Sign in</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage Kusum Foundation applications
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
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
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
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 rounded-md font-medium text-sm hover:bg-gray-800 transition disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="text-center mt-5">
            <Link to="/" className="text-xs text-gray-500 hover:text-gray-900 transition">
              ← Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;