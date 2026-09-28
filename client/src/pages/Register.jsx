import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Register = () => {
  const [mode, setMode] = useState('volunteer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const [volunteerData, setVolunteerData] = useState({
    fullName: '', phone: '', email: '', address: '', occupation: '',
    reasonForJoining: '', startDate: '', endDate: '', department: 'General',
  });

  const [internData, setInternData] = useState({
    fullName: '', phone: '', email: '', address: '', college: '', course: '',
    department: 'General', startDate: '', endDate: '', reasonForJoining: '',
  });

  const handleVolunteerChange = (e) =>
    setVolunteerData({ ...volunteerData, [e.target.name]: e.target.value });
  const handleInternChange = (e) =>
    setInternData({ ...internData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const endpoint = mode === 'volunteer' ? 'volunteers' : 'interns';
    const data = mode === 'volunteer' ? volunteerData : internData;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        if (mode === 'volunteer') {
          setVolunteerData({
            fullName: '', phone: '', email: '', address: '', occupation: '',
            reasonForJoining: '', startDate: '', endDate: '', department: 'General',
          });
        } else {
          setInternData({
            fullName: '', phone: '', email: '', address: '', college: '', course: '',
            department: 'General', startDate: '', endDate: '', reasonForJoining: '',
          });
        }
      } else {
        const d = await response.json();
        setError(d.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
    setIsSubmitting(false);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition';

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
          <div className="p-8 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Join us
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              Register as a volunteer or intern
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the details below. Our team will review your application
              and get back to you.
            </p>
          </div>

          <div className="p-8">
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-14 h-14 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl border border-gray-200">
                  ✓
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Application submitted
                </h2>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  Thank you for applying! Your{' '}
                  {mode === 'volunteer' ? 'volunteer' : 'internship'} application
                  has been received. Our team will review it and get back to you
                  soon.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                >
                  Register another
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex justify-center mb-8">
                  <div className="inline-flex bg-gray-100 rounded-md p-1">
                    <button
                      type="button"
                      onClick={() => { setMode('volunteer'); setError(''); }}
                      className={`px-5 py-2 rounded-md text-sm font-medium transition ${
                        mode === 'volunteer'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Volunteer
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode('intern'); setError(''); }}
                      className={`px-5 py-2 rounded-md text-sm font-medium transition ${
                        mode === 'intern'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Intern
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={mode === 'volunteer' ? volunteerData.fullName : internData.fullName}
                        onChange={mode === 'volunteer' ? handleVolunteerChange : handleInternChange}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={mode === 'volunteer' ? volunteerData.phone : internData.phone}
                        onChange={mode === 'volunteer' ? handleVolunteerChange : handleInternChange}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={mode === 'volunteer' ? volunteerData.email : internData.email}
                        onChange={mode === 'volunteer' ? handleVolunteerChange : handleInternChange}
                        required
                        className={inputClass}
                      />
                    </div>
                    {mode === 'volunteer' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Occupation
                        </label>
                        <input
                          type="text"
                          name="occupation"
                          value={volunteerData.occupation}
                          onChange={handleVolunteerChange}
                          required
                          className={inputClass}
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          College / University
                        </label>
                        <input
                          type="text"
                          name="college"
                          value={internData.college}
                          onChange={handleInternChange}
                          required
                          className={inputClass}
                        />
                      </div>
                    )}
                  </div>

                  {mode === 'intern' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Course / Stream
                      </label>
                      <input
                        type="text"
                        name="course"
                        value={internData.course}
                        onChange={handleInternChange}
                        required
                        placeholder="e.g. B.Com, B.Tech CSE, BA"
                        className={inputClass}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={mode === 'volunteer' ? volunteerData.address : internData.address}
                      onChange={mode === 'volunteer' ? handleVolunteerChange : handleInternChange}
                      required
                      rows="2"
                      className={inputClass}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {mode === 'volunteer' ? 'Start Date' : 'Internship Start Date'}
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={mode === 'volunteer' ? volunteerData.startDate : internData.startDate}
                        onChange={mode === 'volunteer' ? handleVolunteerChange : handleInternChange}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {mode === 'volunteer' ? 'End Date' : 'Internship End Date'}
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={mode === 'volunteer' ? volunteerData.endDate : internData.endDate}
                        onChange={mode === 'volunteer' ? handleVolunteerChange : handleInternChange}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Department
                      </label>
                      <select
                        name="department"
                        value={mode === 'volunteer' ? volunteerData.department : internData.department}
                        onChange={mode === 'volunteer' ? handleVolunteerChange : handleInternChange}
                        className={inputClass}
                      >
                        <option value="General">General</option>
                        <option value="Vocational Training">Vocational Training</option>
                        <option value="Women Empowerment">Women Empowerment</option>
                        <option value="Education Support">Education Support</option>
                        <option value="Community Welfare">Community Welfare</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Reason for Joining
                    </label>
                    <textarea
                      name="reasonForJoining"
                      value={mode === 'volunteer' ? volunteerData.reasonForJoining : internData.reasonForJoining}
                      onChange={mode === 'volunteer' ? handleVolunteerChange : handleInternChange}
                      required
                      rows="4"
                      placeholder={`Tell us why you want to join as a ${mode}...`}
                      className={inputClass}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white py-3.5 rounded-md font-medium text-sm hover:bg-gray-800 transition disabled:opacity-70"
                  >
                    {isSubmitting
                      ? 'Submitting...'
                      : `Submit ${mode === 'volunteer' ? 'Volunteer' : 'Internship'} Application`}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;