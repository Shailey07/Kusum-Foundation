const express = require('express');
const router = express.Router();
const ContentItem = require('../models/ContentItem');
const { protect, authorize } = require('../middleware/authMiddleware');

// Shape a stored document for the client: flatten `data` up so pages can read
// fields directly (title, image, ...) while keeping _id/order/active for admin.
const shape = (doc) => {
  const o = doc.toObject();
  return { _id: o._id, order: o.order, active: o.active, ...(o.data || {}) };
};

/* ---------------- PUBLIC READS ---------------- */

// All content, grouped by section: { story:[...], gallery:[...], ... }
// Public callers get only active items; pass ?all=1 to include hidden ones.
router.get('/', async (req, res) => {
  try {
    const filter = req.query.all === '1' ? {} : { active: true };
    const items = await ContentItem.find(filter).sort({ order: 1, createdAt: 1 });
    const grouped = {};
    for (const it of items) (grouped[it.section] ||= []).push(shape(it));
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// One section as an array.
router.get('/:section', async (req, res) => {
  try {
    const filter = { section: req.params.section };
    if (req.query.all !== '1') filter.active = true;
    const items = await ContentItem.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(items.map(shape));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ------- ADMIN WRITES (main admin or admin only) ------- */
router.use(protect, authorize('superadmin', 'admin'));

// create an item in a section
router.post('/', async (req, res) => {
  try {
    const { section, data = {}, order = 0, active = true } = req.body;
    if (!section)
      return res.status(400).json({ message: 'section is required' });
    if (!ContentItem.SECTIONS.includes(section))
      return res.status(400).json({ message: `Unknown section: ${section}` });
    const item = await ContentItem.create({ section, data, order, active });
    res.status(201).json(shape(item));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update an item (data replace + optional order/active)
router.put('/:id', async (req, res) => {
  try {
    const item = await ContentItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (req.body.data !== undefined) item.data = req.body.data;
    if (req.body.order !== undefined) item.order = req.body.order;
    if (req.body.active !== undefined) item.active = req.body.active;
    item.markModified('data');
    const saved = await item.save();
    res.json(shape(saved));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// quick partial update — used for show/hide and reordering
router.patch('/:id', async (req, res) => {
  try {
    const patch = {};
    ['order', 'active'].forEach((k) => {
      if (req.body[k] !== undefined) patch[k] = req.body[k];
    });
    const item = await ContentItem.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(shape(item));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete an item
router.delete('/:id', async (req, res) => {
  try {
    const item = await ContentItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
