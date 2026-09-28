const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Every account that can log in is a User. Roles decide which portal they see.
const ROLES = [
  'superadmin', // the "main admin" — the only role allowed to create other accounts
  'admin', // manages content, projects, donations, applications
  'staff', // field officer — beneficiaries, field visits, attendance
  'volunteer',
  'donor',
  'beneficiary',
  'corporate',
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    username: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ROLES, default: 'staff', index: true },

    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    designation: { type: String, trim: true }, // staff/admin job title
    avatar: { type: String }, // optional image URL
    status: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Active' },

    // volunteer-specific
    skills: [{ type: String }],
    availability: { type: String },
    interests: [{ type: String }],
    hoursLogged: { type: Number, default: 0 },

    // beneficiary-specific
    program: { type: String },
    eligibilityStatus: { type: String },
    caseStatus: { type: String },

    // corporate-specific
    companyName: { type: String },
    website: { type: String },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Return a copy safe to send to the client (no password hash).
userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.statics.ROLES = ROLES;

module.exports = mongoose.model('User', userSchema);
