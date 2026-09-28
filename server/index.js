const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const contentRoutes = require('./routes/content');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');
const Admin = require('./models/Admin');
const User = require('./models/User');
const Counter = require('./models/Counter');
const ContentItem = require('./models/ContentItem');
const Setting = require('./models/Setting');
const { seedContent, seedSettings } = require('./data/seedContent');

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Raised limit so admins can upload base64 photos through /api/upload.
app.use(express.json({ limit: '8mb' }));

// Serve admin-uploaded photos as static files.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Kusum Foundation Backend is Running 🚀');
});

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const vCounter = await Counter.findOne({ id: 'volunteerRegistration' });
  if (!vCounter) {
    await Counter.create({ id: 'volunteerRegistration', seq: 1462 });
    console.log('✅ Volunteer Counter initialized at 1462 → Next: KF/V/2026/1463');
  } else {
    console.log('ℹ️  Volunteer Counter exists at:', vCounter.seq);
  }

  const iCounter = await Counter.findOne({ id: 'internRegistration' });
  if (!iCounter) {
    await Counter.create({ id: 'internRegistration', seq: 1000 });
    console.log('✅ Intern Counter initialized at 1000 → Next: KF/I/2026/1001');
  } else {
    console.log('ℹ️  Intern Counter exists at:', iCounter.seq);
  }

  const admin = await Admin.findOne({ username: 'admin1907' });
  if (!admin) {
    await Admin.create({ username: 'admin1907', password: 'Admin@1907' });
    console.log('✅ Default Admin created: admin1907 / Admin@1907');
  } else {
    console.log('ℹ️  Admin already exists: admin1907');
  }

  // Unified auth: ensure a main-admin (superadmin) User exists.
  const superadmin = await User.findOne({ role: 'superadmin' });
  if (!superadmin) {
    await User.create({
      name: 'Main Admin',
      username: 'admin1907',
      email: 'admin@kusumfoundation.org',
      password: 'Admin@1907',
      role: 'superadmin',
      status: 'Active',
    });
    console.log('✅ Main admin (superadmin) created: admin1907 / Admin@1907');
  } else {
    console.log('ℹ️  Main admin already exists:', superadmin.username || superadmin.email);
  }

  // Seed editable site content (stories, gallery, programs, projects, news…)
  // the first time only. After this it's fully managed from the admin panel.
  const contentCount = await ContentItem.countDocuments();
  if (contentCount === 0) {
    await ContentItem.insertMany(seedContent);
    console.log(`✅ Seeded ${seedContent.length} content items with real photos`);
  } else {
    console.log(`ℹ️  Content already present: ${contentCount} items`);
  }

  // Seed the site settings singleton (contact info, socials, impact numbers).
  const existingSettings = await Setting.findOne({ key: 'site' });
  if (!existingSettings) {
    await Setting.create({ key: 'site', ...seedSettings });
    console.log('✅ Seeded site settings (contact, socials, impact, funds)');
  } else {
    console.log('ℹ️  Site settings already present');
  }

  app.listen(PORT, () =>
    console.log(`🚀 Kusum Foundation server on port ${PORT}`)
  );
};

startServer();