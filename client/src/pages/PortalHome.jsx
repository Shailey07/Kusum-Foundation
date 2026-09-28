import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LogOut, CalendarDays, Clock, Award, HeartHandshake, Receipt,
  Repeat, FileText, ClipboardList, MapPin, Building2, FolderKanban,
  UserCircle, BadgeCheck,
} from 'lucide-react';
import { getUser, logout, ROLE_LABELS } from '../utils/auth';

// Role-specific tiles. Features roll out in later passes, so tiles are shown as
// "coming soon" — the portal still reflects the real, logged-in account today.
const ROLE_TILES = {
  volunteer: [
    { icon: CalendarDays, label: 'Opportunities & Events' },
    { icon: ClipboardList, label: 'Assigned Tasks' },
    { icon: Clock, label: 'My Volunteer Hours' },
    { icon: Award, label: 'Certificates' },
  ],
  donor: [
    { icon: HeartHandshake, label: 'Donation History' },
    { icon: Receipt, label: 'Receipts' },
    { icon: Repeat, label: 'Monthly Giving' },
    { icon: FileText, label: 'Tax Documents' },
  ],
  beneficiary: [
    { icon: FolderKanban, label: 'My Program' },
    { icon: ClipboardList, label: 'Assistance History' },
    { icon: FileText, label: 'My Documents' },
    { icon: BadgeCheck, label: 'Application Status' },
  ],
  corporate: [
    { icon: FolderKanban, label: 'Our Projects' },
    { icon: FileText, label: 'Proposals' },
    { icon: ClipboardList, label: 'Impact Reports' },
    { icon: Building2, label: 'CSR Partnership' },
  ],
  staff: [
    { icon: UserCircle, label: 'Add Beneficiary' },
    { icon: MapPin, label: 'Field Visits' },
    { icon: Clock, label: 'Attendance' },
    { icon: FileText, label: 'Submit Reports' },
  ],
};

const PortalHome = () => {
  const navigate = useNavigate();
  const user = getUser() || {};
  const role = user.role || 'volunteer';
  const tiles = ROLE_TILES[role] || ROLE_TILES.volunteer;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const statusColor =
    user.status === 'Active'
      ? 'bg-green-50 text-green-700 ring-green-100'
      : user.status === 'Pending'
      ? 'bg-amber-50 text-amber-700 ring-amber-100'
      : 'bg-gray-100 text-gray-600 ring-gray-200';

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 px-3 py-1 text-xs font-medium ring-1 ring-rose-100">
              <BadgeCheck size={13} /> {ROLE_LABELS[role] || role}
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              Welcome, {user.name || 'Member'}.
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              This is your Kusum Foundation portal.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* Profile summary */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Your details</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {[
              ['Name', user.name],
              ['Email', user.email],
              ['Phone', user.phone],
              ['Location', user.location],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xs text-gray-400">{k}</div>
                <div className="text-gray-800 mt-0.5 break-words">{v || '—'}</div>
              </div>
            ))}
            <div>
              <div className="text-xs text-gray-400">Status</div>
              <span className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusColor}`}>
                {user.status || 'Active'}
              </span>
            </div>
          </div>
          {user.status === 'Pending' && (
            <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md p-3">
              Your account is pending verification by our team. You'll get full
              access once it's approved.
            </p>
          )}
        </div>

        {/* Role tiles */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Your tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiles.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.label}
                  className="relative bg-white border border-gray-200 rounded-xl p-6 opacity-90"
                >
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">{t.label}</h3>
                  <span className="absolute top-4 right-4 text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
                    Coming soon
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalHome;
