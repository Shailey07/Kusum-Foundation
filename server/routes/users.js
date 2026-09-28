const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// The whole user-management surface is restricted to the main admin (superadmin).
// This enforces the rule: only the main admin can create staff / other accounts.
router.use(protect, authorize('superadmin'));

/* list users, optional ?role= and ?q= (search name/email) */
router.get('/', async (req, res) => {
  try {
    const { role, q } = req.query;
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { username: new RegExp(q, 'i') },
        { designation: new RegExp(q, 'i') },
      ];
    }
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* create any account (staff, admin, or a portal user on their behalf) */
router.post('/', async (req, res) => {
  try {
    const {
      name, email, username, password, role, phone,
      location, designation, status,
    } = req.body;

    if (!name || !password)
      return res.status(400).json({ message: 'Name and password are required' });
    if (!email && !username)
      return res.status(400).json({ message: 'Provide an email or a username' });

    if (email) {
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists) return res.status(400).json({ message: 'Email already in use' });
    }
    if (username) {
      const exists = await User.findOne({ username });
      if (exists) return res.status(400).json({ message: 'Username already in use' });
    }

    const user = await User.create({
      name, email, username, password,
      role: role || 'staff',
      phone, location, designation,
      status: status || 'Active',
      createdBy: req.user._id,
    });

    res.status(201).json(user.toSafeJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// __APPEND__

/* update an account (fields + optional password reset) */
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const fields = [
      'name', 'email', 'username', 'role', 'phone',
      'location', 'designation', 'status', 'companyName', 'website',
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) user[f] = req.body[f];
    });
    // only overwrite the password if a non-empty new one was sent
    if (req.body.password) user.password = req.body.password;

    const saved = await user.save();
    res.json(saved.toSafeJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* quick activate / deactivate */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Inactive', 'Pending'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* delete — but never allow removing a superadmin (protects the main admin) */
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'superadmin')
      return res.status(403).json({ message: 'The main admin account cannot be deleted' });
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
