import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Menu, X, LayoutDashboard, Users, GraduationCap, LogOut, ChevronRight, QrCode, Download, UserCog, FileText, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [volunteers, setVolunteers] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [qrTarget, setQrTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  // Only the main admin (superadmin) manages users. Legacy admin tokens (no user
  // object) are treated as the main admin, matching the server-side fallback.
  const role = userInfo?.user?.role;
  const canManageUsers = role === 'superadmin' || (!!userInfo && !userInfo.user);
  // Both admins and the main admin can edit site content and settings.
  const canManageContent = role === 'superadmin' || role === 'admin' || (!!userInfo && !userInfo.user);

  useEffect(() => {
    if (!userInfo) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vRes, iRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/volunteers`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/interns`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }),
      ]);
      if (vRes.ok) setVolunteers(await vRes.json());
      if (iRes.ok) setInterns(await iRes.json());
    } catch (err) {
      console.error('Error fetching data', err);
    }
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/admin/login');
  };

  const handleApprove = async (type, id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/${type}/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        showToast(`${type === 'volunteers' ? 'Volunteer' : 'Intern'} approved`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (type, id) => {
    if (!window.confirm('Reject this application?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/${type}/${id}/reject`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        showToast('Application rejected');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type === 'volunteers' ? 'volunteer' : 'intern'}?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        showToast('Deleted');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'volunteers', label: `Volunteers (${volunteers.length})`, icon: Users },
    { id: 'interns', label: `Interns (${interns.length})`, icon: GraduationCap },
  ];

  const renderTable = (items, type) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Department</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Reg No.</th>
              <th className="p-4 font-medium">Duration</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((person) => (
              <tr key={person._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900 text-sm">{person.fullName}</td>
                <td className="p-4">
                  <div className="text-sm text-gray-700 break-all">{person.email}</div>
                  <div className="text-xs text-gray-500">{person.phone}</div>
                </td>
                <td className="p-4 text-sm text-gray-700">{person.department || 'General'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                    person.status === 'Approved' ? 'bg-green-50 text-green-700' :
                    person.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                    'bg-orange-50 text-orange-700'
                  }`}>
                    {person.status}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-gray-700">
                  {person.registrationNumber || '-'}
                </td>
                <td className="p-4 text-xs text-gray-600 whitespace-nowrap">
                  {person.startDate
                    ? new Date(person.startDate).toLocaleDateString('en-GB')
                    : '—'}
                  {' → '}
                  {person.endDate
                    ? new Date(person.endDate).toLocaleDateString('en-GB')
                    : '—'}
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {person.status === 'Pending' && (
                      <>
                        <button onClick={() => handleApprove(type, person._id)} className="bg-gray-900 text-white px-2.5 py-1 rounded text-xs hover:bg-gray-800 whitespace-nowrap">
                          Approve
                        </button>
                        <button onClick={() => handleReject(type, person._id)} className="bg-white border border-gray-300 text-gray-700 px-2.5 py-1 rounded text-xs hover:bg-gray-50 whitespace-nowrap">
                          Reject
                        </button>
                      </>
                    )}
                    {person.status === 'Approved' && person.registrationNumber && (
                      <button
                        onClick={() => setQrTarget(person)}
                        className="bg-white border border-gray-300 text-gray-700 px-2.5 py-1 rounded text-xs hover:bg-gray-50 whitespace-nowrap flex items-center gap-1"
                      >
                        <QrCode size={13} />
                        QR Code
                      </button>
                    )}
                    <button onClick={() => handleDelete(type, person._id)} className="bg-white border border-red-200 text-red-600 px-2.5 py-1 rounded text-xs hover:bg-red-50 whitespace-nowrap">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500 text-sm">
                  No {type} found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-gray-100">
        {items.map((person) => (
          <div key={person._id} className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <div className="font-medium text-gray-900 text-sm">{person.fullName}</div>
                <div className="text-xs text-gray-500 break-all">{person.email}</div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium shrink-0 ${
                person.status === 'Approved' ? 'bg-green-50 text-green-700' :
                person.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                'bg-orange-50 text-orange-700'
              }`}>{person.status}</span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>📞 {person.phone}</div>
              <div>🏢 {person.department || 'General'}</div>
              <div>🔑 {person.registrationNumber || '-'}</div>
              <div>
                📅 {person.startDate ? new Date(person.startDate).toLocaleDateString('en-GB') : '—'}
                {' → '}
                {person.endDate ? new Date(person.endDate).toLocaleDateString('en-GB') : '—'}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {person.status === 'Pending' && (
                <>
                  <button onClick={() => handleApprove(type, person._id)} className="flex-1 bg-gray-900 text-white px-3 py-2 rounded text-xs">Approve</button>
                  <button onClick={() => handleReject(type, person._id)} className="flex-1 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded text-xs">Reject</button>
                </>
              )}
              {person.status === 'Approved' && person.registrationNumber && (
                <button
                  onClick={() => setQrTarget(person)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded text-xs flex items-center justify-center gap-1"
                >
                  <QrCode size={13} />
                  QR Code
                </button>
              )}
              <button onClick={() => handleDelete(type, person._id)} className={`${person.status === 'Pending' ? 'flex-1' : 'w-full'} bg-white border border-red-200 text-red-600 px-3 py-2 rounded text-xs`}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">No {type} found.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-2.5 rounded-md shadow-lg text-sm ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {qrTarget && (
        <QRModal
          person={qrTarget}
          onClose={() => setQrTarget(null)}
        />
      )}

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`fixed lg:static inset-y-0 left-0 z-30 w-60 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500 mt-0.5">Kusum Foundation</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition flex items-center gap-2.5 ${
                  activeTab === item.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {activeTab === item.id && <ChevronRight size={14} className="ml-auto text-gray-400" />}
              </button>
            );
          })}

          {canManageContent && (
            <button
              onClick={() => { setSidebarOpen(false); navigate('/admin/content'); }}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition flex items-center gap-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <FileText size={16} />
              <span>Site Content</span>
              <ChevronRight size={14} className="ml-auto text-gray-300" />
            </button>
          )}

          {canManageContent && (
            <button
              onClick={() => { setSidebarOpen(false); navigate('/admin/settings'); }}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition flex items-center gap-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <Settings size={16} />
              <span>Site Settings</span>
              <ChevronRight size={14} className="ml-auto text-gray-300" />
            </button>
          )}

          {canManageUsers && (
            <button
              onClick={() => { setSidebarOpen(false); navigate('/admin/users'); }}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition flex items-center gap-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <UserCog size={16} />
              <span>Manage Users</span>
              <ChevronRight size={14} className="ml-auto text-gray-300" />
            </button>
          )}
        </div>

        <div className="p-3 border-t border-gray-200">
          <button onClick={handleLogout} className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold text-gray-900 capitalize">{activeTab}</h1>
          <div className="w-5" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="hidden lg:block mb-6">
            <h1 className="text-xl font-semibold text-gray-900 capitalize">{activeTab}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage {activeTab === 'dashboard' ? 'overview' : activeTab}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500 text-sm">Loading...</div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Volunteers', value: volunteers.length, color: 'text-gray-900' },
                    { label: 'Approved Volunteers', value: volunteers.filter(v => v.status === 'Approved').length, color: 'text-green-600' },
                    { label: 'Pending Volunteers', value: volunteers.filter(v => v.status === 'Pending').length, color: 'text-orange-500' },
                    { label: 'Total Interns', value: interns.length, color: 'text-gray-900' },
                    { label: 'Approved Interns', value: interns.filter(v => v.status === 'Approved').length, color: 'text-green-600' },
                    { label: 'Pending Interns', value: interns.filter(v => v.status === 'Pending').length, color: 'text-orange-500' },
                  ].map((s) => (
                    <div key={s.label} className="bg-white p-5 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
                        {s.label}
                      </p>
                      <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'volunteers' && renderTable(volunteers, 'volunteers')}
              {activeTab === 'interns' && renderTable(interns, 'interns')}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function QRModal({ person, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [error, setError] = useState(false);

  const verifyUrl = `${window.location.origin}/verify/${encodeURIComponent(
    person.registrationNumber
  )}`;

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(verifyUrl, {
      width: 600,
      margin: 1,
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR generation failed', err);
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [verifyUrl]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `Kusum-QR-${person.registrationNumber.replace(/\//g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-sm w-full rounded-lg border border-gray-200 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Verification QR Code
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Print this on the certificate. Scanning opens the verification page.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          {error ? (
            <p className="text-sm text-red-600 py-10">
              Could not generate QR code.
            </p>
          ) : qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Verification QR code"
              className="w-52 h-52 border border-gray-200 rounded-md"
            />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full" />
            </div>
          )}

          <p className="text-sm font-semibold text-gray-900 mt-4 text-center">
            {person.fullName}
          </p>
          <p className="text-xs font-mono text-gray-500 mt-1 text-center break-all">
            {person.registrationNumber}
          </p>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="flex-1 bg-gray-900 text-white py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Download size={15} />
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}


export default AdminDashboard;