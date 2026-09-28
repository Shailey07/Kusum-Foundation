const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { protect, authorize } = require('../middleware/authMiddleware');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Map an image mime type to a file extension.
const EXT = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg',
  'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg',
};

// Admin uploads a photo as a base64 data URL; we decode and store it, then
// return an absolute URL that the public site can hotlink directly.
router.post('/', protect, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const { dataUrl } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string')
      return res.status(400).json({ message: 'dataUrl is required' });

    const match = dataUrl.match(/^data:([\w/+.-]+);base64,(.+)$/);
    if (!match) return res.status(400).json({ message: 'Invalid data URL' });

    const mime = match[1];
    const ext = EXT[mime];
    if (!ext) return res.status(400).json({ message: 'Only image files are allowed' });

    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length > 8 * 1024 * 1024)
      return res.status(413).json({ message: 'Image too large (max 8MB)' });

    const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, name), buffer);

    const url = `${req.protocol}://${req.get('host')}/uploads/${name}`;
    res.status(201).json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
