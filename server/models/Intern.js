const mongoose = require('mongoose');

const internSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    department: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reasonForJoining: { type: String, required: true },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Approved', 'Rejected'],
    },
    registrationNumber: { type: String, unique: true, sparse: true },
    certificateNumber: { type: String },
    certificateIssueDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Intern', internSchema);