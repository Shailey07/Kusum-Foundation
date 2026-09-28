const mongoose = require('mongoose');

// A single, generic collection powers every "list" the admin can edit:
// success stories, gallery photos, news, events, press mentions, reports,
// programs and projects. Each document is one item within a section.
// `data` is a free-form object so each section can carry its own fields
// (see server/data/seedContent.js for the shape of each section).
const SECTIONS = [
  'story',
  'gallery',
  'news',
  'event',
  'press',
  'report',
  'program',
  'project',
];

const contentItemSchema = new mongoose.Schema(
  {
    section: { type: String, enum: SECTIONS, required: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 }, // lower shows first
    active: { type: Boolean, default: true }, // soft hide without deleting
  },
  { timestamps: true, minimize: false }
);

// Keep a stable ordering: by `order`, then newest first.
contentItemSchema.index({ section: 1, order: 1, createdAt: -1 });

contentItemSchema.statics.SECTIONS = SECTIONS;

module.exports = mongoose.model('ContentItem', contentItemSchema);
