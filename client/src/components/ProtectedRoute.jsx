import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getRole, dashboardPath } from '../utils/auth';

// Guards a route. Pass allowedRoles to restrict to specific roles; omit to allow
// any authenticated user. Legacy tokens (no client-side role) are treated as admin.
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && allowedRoles.length) {
    const role = getRole();
    if (role && !allowedRoles.includes(role)) {
      return <Navigate to={dashboardPath(role)} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;