const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Volunteer = require('../models/Volunteer');
const Intern = require('../models/Intern');
const Authority = require('../models/Authority');
const Counter = require('../models/Counter');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

/* ============ ADMIN LOGIN ============ */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

/* ==================== VOLUNTEERS ==================== */
router.post('/volunteers', async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/volunteers', protect, async (req, res) => {
  const volunteers = await Volunteer.find({}).sort({ createdAt: -1 });
  res.json(volunteers);
});

router.patch('/volunteers/:id/approve', protect, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer)
      return res.status(404).json({ message: 'Volunteer not found' });
    if (volunteer.status === 'Approved')
      return res.status(400).json({ message: 'Already approved' });

    const counter = await Counter.findOneAndUpdate(
      { id: 'volunteerRegistration' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const year = new Date().getFullYear();
    volunteer.status = 'Approved';
    volunteer.registrationNumber = `KF/V/${year}/${counter.seq}`;
    volunteer.certificateNumber = `CERT-KF-V-${year}-${counter.seq}`;
    volunteer.certificateIssueDate = new Date();
    if (!volunteer.certificateDate) volunteer.certificateDate = new Date();

    const updated = await volunteer.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/volunteers/:id/certificate-date', protect, async (req, res) => {
  try {
    const { certificateDate, certificateIssueDate } = req.body;
    const update = {};
    if (certificateDate) update.certificateDate = new Date(certificateDate);
    if (certificateIssueDate)
      update.certificateIssueDate = new Date(certificateIssueDate);

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!volunteer)
      return res.status(404).json({ message: 'Volunteer not found' });
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/volunteers/:id/reject', protect, async (req, res) => {
  try {
    const v = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    res.json(v);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/volunteers/:id', protect, async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Volunteer removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ==================== INTERNS ==================== */
router.post('/interns', async (req, res) => {
  try {
    const intern = await Intern.create(req.body);
    res.status(201).json(intern);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/interns', protect, async (req, res) => {
  const interns = await Intern.find({}).sort({ createdAt: -1 });
  res.json(interns);
});

router.patch('/interns/:id/approve', protect, async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ message: 'Intern not found' });
    if (intern.status === 'Approved')
      return res.status(400).json({ message: 'Already approved' });

    const counter = await Counter.findOneAndUpdate(
      { id: 'internRegistration' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const year = new Date().getFullYear();
    intern.status = 'Approved';
    intern.registrationNumber = `KF/I/${year}/${counter.seq}`;
    intern.certificateNumber = `CERT-KF-I-${year}-${counter.seq}`;
    intern.certificateIssueDate = new Date();

    const updated = await intern.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/interns/:id/certificate-date', protect, async (req, res) => {
  try {
    const { certificateIssueDate } = req.body;
    const update = {};
    if (certificateIssueDate)
      update.certificateIssueDate = new Date(certificateIssueDate);

    const intern = await Intern.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!intern) return res.status(404).json({ message: 'Intern not found' });
    res.json(intern);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/interns/:id/reject', protect, async (req, res) => {
  try {
    const i = await Intern.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    res.json(i);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/interns/:id', protect, async (req, res) => {
  try {
    await Intern.findByIdAndDelete(req.params.id);
    res.json({ message: 'Intern removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ============ COMBINED VERIFY ============ */
router.get('/verify/:registrationNumber', async (req, res) => {
  try {
    const regNo = req.params.registrationNumber;

    const volunteer = await Volunteer.findOne({
      registrationNumber: regNo,
      status: 'Approved',
    });
    if (volunteer) return res.json({ type: 'volunteer', data: volunteer });

    const intern = await Intern.findOne({
      registrationNumber: regNo,
      status: 'Approved',
    });
    if (intern) return res.json({ type: 'intern', data: intern });

    res.status(404).json({ message: 'Certificate Not Found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ==================== AUTHORITIES ==================== */
router.get('/authorities', async (req, res) => {
  const authorities = await Authority.find({}).sort({ createdAt: 1 });
  res.json(authorities);
});

router.post('/authorities', protect, async (req, res) => {
  try {
    const authority = await Authority.create(req.body);
    res.status(201).json(authority);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/authorities/:id', protect, async (req, res) => {
  try {
    const authority = await Authority.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(authority);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/authorities/:id', protect, async (req, res) => {
  try {
    await Authority.findByIdAndDelete(req.params.id);
    res.json({ message: 'Authority removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;