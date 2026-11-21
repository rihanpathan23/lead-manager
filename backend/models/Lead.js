const mongoose = require('mongoose');

const LEAD_SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Advertisement',
  'Other',
];

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[0-9+\-\s()]{7,20}$/,
        'Please provide a valid phone number',
      ],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    source: {
      type: String,
      required: [true, 'Lead source is required'],
      enum: {
        values: LEAD_SOURCES,
        message: 'Invalid lead source selected',
      },
    },
    status: {
      type: String,
      enum: {
        values: LEAD_STATUSES,
        message: 'Status must be New, Contacted, Qualified, or Lost',
      },
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search, filtering, and sorting
leadSchema.index({ name: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });

module.exports = {
  Lead: mongoose.model('Lead', leadSchema),
  LEAD_SOURCES,
  LEAD_STATUSES,
};