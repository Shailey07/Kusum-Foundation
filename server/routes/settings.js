const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public: read the site settings (contact info, socials, impact numbers, etc.)
router.get('/', async (req, res) => {
  try {
    const doc = await Setting.getSite();
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: update any subset of the settings fields.
router.put('/', protect, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const doc = await Setting.getSite();
    const fields = [
      'orgInfo', 'socials', 'siteImages', 'impactStats', 'impactHighlights',
      'fundUtilization', 'causes', 'donationPresets',
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        doc[f] = req.body[f];
        doc.markModified(f);
      }
    });
    const saved = await doc.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
