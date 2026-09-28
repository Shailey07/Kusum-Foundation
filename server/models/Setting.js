const mongoose = require('mongoose');

// A single settings document (singleton) holding everything on the site that
// isn't a repeating list: organisation contact details, social links, the
// impact numbers, fund-utilisation breakdown, donation causes and presets.
// We always read/write the one document tagged { key: 'site' }.
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true, index: true },

    orgInfo: { type: mongoose.Schema.Types.Mixed, default: {} },
    socials: { type: mongoose.Schema.Types.Mixed, default: {} },
    siteImages: { type: mongoose.Schema.Types.Mixed, default: {} },
    impactStats: { type: [mongoose.Schema.Types.Mixed], default: [] },
    impactHighlights: { type: [mongoose.Schema.Types.Mixed], default: [] },
    fundUtilization: { type: [mongoose.Schema.Types.Mixed], default: [] },
    causes: { type: [mongoose.Schema.Types.Mixed], default: [] },
    donationPresets: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

// Convenience: fetch the one site-settings doc, creating it if missing.
settingSchema.statics.getSite = async function () {
  let doc = await this.findOne({ key: 'site' });
  if (!doc) doc = await this.create({ key: 'site' });
  return doc;
};

module.exports = mongoose.model('Setting', settingSchema);
