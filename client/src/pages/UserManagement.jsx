import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus, Search, Pencil, Trash2, Power, ArrowLeft, X, ShieldAlert,
} from 'lucide-react';
import { API, authHeader, ROLE_LABELS } from '../utils/auth';

const CREATABLE_ROLES = ['admin', 'staff', 'volunteer', 'donor', 'beneficiary', 'corporate'];
const EMPTY = {
  name: '', email: '', username: '', password: '',
  role: 'staff', phone: '', designation: '', status: 'Active',
};

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [q, setQ] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const flash = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterRole !== 'all') params.set('role', filterRole);
      if (q) params.set('q', q);
      const res = await fetch(`${API}/users?${params.toString()}`, {
        headers: authHeader(),
      });
      if (res.ok) setUsers(await res.json());
      else if (res.status === 403) setError('Only the main admin can manage users.');
    } catch {
      setError('Could not load users.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); /* eslint-disable-next-line */ }, [filterRole]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setError('');
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({
      name: u.name || '', email: u.email || '', username: u.username || '',
      password: '', role: u.role || 'staff', phone: u.phone || '',
      designation: u.designation || '', status: u.status || 'Active',
    });
    setError('');
    setShowModal(true);
  };

  const saveUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url = editing ? `${API}/users/${editing._id}` : `${API}/users`;
      const method = editing ? 'PUT' : 'POST';
      const body = { ...form };
      if (editing && !body.password) delete body.password; // keep existing pw
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        flash(editing ? 'User updated' : 'User created');
        fetchUsers();
      } else {
        setError(data.message || 'Could not save user');
      }
    } catch {
      setError('Server error. Please try again.');
    }
    setSaving(false);
  };

  const toggleStatus = async (u) => {
    const next = u.status === 'Active' ? 'Inactive' : 'Active';
    const res = await fetch(`${API}/users/${u._id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) { flash(`User ${next.toLowerCase()}`); fetchUsers(); }
    else flash('Could not update status', 'error');
  };

  const deleteUser = async (u) => {
    if (!window.confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    const res = await fetch(`${API}/users/${u._id}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) { flash('User removed'); fetchUsers(); }
    else flash(data.message || 'Could not delete user', 'error');
  };

  const roleBadge = (role) => {
    const map = {
      superadmin: 'bg-rose-50 text-rose-700 ring-rose-100',
      admin: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
      staff: 'bg-teal-50 text-teal-700 ring-teal-100',
      volunteer: 'bg-amber-50 text-amber-700 ring-amber-100',
      donor: 'bg-green-50 text-green-700 ring-green-100',
      beneficiary: 'bg-sky-50 text-sky-700 ring-sky-100',
      corporate: 'bg-purple-50 text-purple-700 ring-purple-100',
    };
    return map[role] || 'bg-gray-100 text-gray-600 ring-gray-200';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition mb-5"
        >
          <ArrowLeft size={15} /> Back to dashboard
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              User Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage staff, admins and portal accounts. Only the main
              admin can access this page.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-rose-700 text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-rose-800 transition"
          >
            <UserPlus size={16} /> Add user
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              placeholder="Search name, email, username…"
              className="w-full pl-9 pr-4 py-2.5 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="py-2.5 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:border-gray-900"
          >
            <option value="all">All roles</option>
            {['superadmin', ...CREATABLE_ROLES].map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>
            ))}
          </select>
          <button
            onClick={fetchUsers}
            className="py-2.5 px-4 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Search
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 bg-red-50 text-red-700 border border-red-100 p-3 rounded-md text-sm">
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        {/* Table */}
        <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Name</th>
                  <th className="text-left font-medium px-4 py-3">Login</th>
                  <th className="text-left font-medium px-4 py-3">Role</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-left font-medium px-4 py-3">Phone</th>
                  <th className="text-right font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No users found.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{u.name}</div>
                        {u.designation && <div className="text-xs text-gray-400">{u.designation}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email || u.username || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${roleBadge(u.role)}`}>
                          {ROLE_LABELS[u.role] || u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                          u.status === 'Active' ? 'bg-green-50 text-green-700 ring-green-100'
                          : u.status === 'Pending' ? 'bg-amber-50 text-amber-700 ring-amber-100'
                          : 'bg-gray-100 text-gray-500 ring-gray-200'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(u)} title="Edit" className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => toggleStatus(u)} title={u.status === 'Active' ? 'Deactivate' : 'Activate'} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                            <Power size={15} />
                          </button>
                          {u.role !== 'superadmin' && (
                            <button onClick={() => deleteUser(u)} title="Delete" className="p-2 rounded-md text-red-500 hover:bg-red-50">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-base font-semibold text-gray-900">
                {editing ? 'Edit user' : 'Add new user'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveUser} className="px-6 py-5 space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-100 p-2.5 rounded-md text-sm">
                  <ShieldAlert size={15} /> {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
                  <input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Password {editing && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editing}
                  minLength={6}
                  placeholder={editing ? '••••••••' : 'Minimum 6 characters'}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Role *</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm bg-white focus:outline-none focus:border-gray-900"
                  >
                    {CREATABLE_ROLES.map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm bg-white focus:outline-none focus:border-gray-900"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Designation</label>
                  <input
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    placeholder="e.g. Field Officer"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-md bg-rose-700 text-white text-sm font-medium hover:bg-rose-800 transition disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editing ? 'Save changes' : 'Create user'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-md text-sm text-white shadow-lg ${toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default UserManagement;