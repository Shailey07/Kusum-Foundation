const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Verifies the Bearer token. Supports the new unified User tokens (which carry a
// `role`) and legacy Admin tokens (no role) so the existing admin dashboard keeps
// working. Sets both req.user (new) and req.admin (legacy) for compatibility.
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      // New unified User token
      if (decoded.role) {
        const user = await User.findById(decoded.id).select('-password');
        if (!user)
          return res.status(401).json({ message: 'Not authorized, user not found' });
        if (user.status === 'Inactive')
          return res.status(403).json({ message: 'Account is inactive' });
        req.user = user;
        req.admin = user; // backward-compat for older handlers
        return next();
      }

      // Legacy Admin token (payload had only { id })
      const admin = await Admin.findById(decoded.id).select('-password');
      if (admin) {
        req.admin = admin;
        req.user = {
          _id: admin._id,
          name: admin.username,
          username: admin.username,
          role: 'superadmin',
        };
        return next();
      }

      return res.status(401).json({ message: 'Not authorized' });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Gate a route to one or more roles, e.g. authorize('superadmin').
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };

module.exports = { protect, authorize };