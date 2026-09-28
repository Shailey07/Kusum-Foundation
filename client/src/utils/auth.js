// Central auth helpers. A logged-in session is stored in localStorage under
// "userInfo" as { token, user }. Legacy admin sessions may only have { token }.

export const API = import.meta.env.VITE_API_URL; // e.g. http://localhost:5000/api

export const getUserInfo = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo') || 'null');
  } catch {
    return null;
  }
};

export const getToken = () => getUserInfo()?.token || null;
export const getUser = () => getUserInfo()?.user || null;
export const getRole = () => getUser()?.role || null;
export const isAuthed = () => !!getToken();
export const hasRole = (...roles) => roles.includes(getRole());

export const setUserInfo = (data) =>
  localStorage.setItem('userInfo', JSON.stringify(data));

export const logout = () => localStorage.removeItem('userInfo');

export const authHeader = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// Where each role lands after login.
export const dashboardPath = (role) => {
  if (role === 'superadmin' || role === 'admin') return '/admin/dashboard';
  return '/portal';
};

export const ROLE_LABELS = {
  superadmin: 'Main Admin',
  admin: 'Admin',
  staff: 'Field Staff',
  volunteer: 'Volunteer',
  donor: 'Donor',
  beneficiary: 'Beneficiary',
  corporate: 'Corporate Partner',
};