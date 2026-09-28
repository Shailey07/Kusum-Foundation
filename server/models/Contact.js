const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: 150,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    subject: {
      type: String,
      enum: ['General Inquiry', 'Volunteer', 'Donation', 'Partnership', 'Other'],
      default: 'General Inquiry',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['New', 'Read', 'Replied'],
      default: 'New',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);