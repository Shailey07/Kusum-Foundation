const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const genToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });

// Roles the public is allowed to self-register as. Staff/admin are created only
// by the main admin from the admin portal.
const SELF_SIGNUP_ROLES = ['donor', 'volunteer', 'beneficiary', 'corporate'];

/* ============ PUBLIC SELF-REGISTRATION ============ */
router.post('/register', async (req, res) => {
  try {
    const {
      name, email, password, role, phone, location,
      skills, availability, interests, companyName, website,
    } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const finalRole = SELF_SIGNUP_ROLES.includes(role) ? role : 'donor';

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'This email is already registered' });

    const user = await User.create({
      name, email, password, role: finalRole, phone, location,
      skills, availability, interests, companyName, website,
      // beneficiaries need admin verification before they are active
      status: finalRole === 'beneficiary' ? 'Pending' : 'Active',
    });

    res.status(201).json({ token: genToken(user), user: user.toSafeJSON() });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// __APPEND__

/* ============ UNIFIED LOGIN (email OR username) ============ */
router.post('/login', async (req, res) => {
  try {
    const { identifier, email, username, password } = req.body;
    const id = (identifier || email || username || '').trim();
    if (!id || !password)
      return res.status(400).json({ message: 'Please enter your login and password' });

    const user = await User.findOne({
      $or: [{ email: id.toLowerCase() }, { username: id }],
    }).select('+password');

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid login or password' });

    if (user.status === 'Inactive')
      return res.status(403).json({ message: 'Your account is inactive. Please contact the admin.' });

    user.lastLogin = new Date();
    await user.save();

    res.json({ token: genToken(user), user: user.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ============ CURRENT USER ============ */
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
