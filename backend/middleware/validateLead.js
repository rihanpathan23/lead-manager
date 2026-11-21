const mongoose = require('mongoose');
const { LEAD_SOURCES, LEAD_STATUSES } = require('../models/Lead');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid lead ID format',
    });
  }
  next();
};

const validateLeadFields = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.name !== undefined) {
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!name) {
      errors.name = 'Lead name is required';
    } else if (name.length < 2 || name.length > 100) {
      errors.name = 'Name must be between 2 and 100 characters';
    }
  }

  if (!isUpdate || data.email !== undefined) {
    const email = typeof data.email === 'string' ? data.email.trim() : '';
    if (!email) {
      errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Please provide a valid email address';
    }
  }

  if (!isUpdate || data.phone !== undefined) {
    const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
    if (!phone) {
      errors.phone = 'Phone number is required';
    } else if (!PHONE_REGEX.test(phone)) {
      errors.phone = 'Please provide a valid phone number (7-20 digits)';
    }
  }

  if (!isUpdate || data.company !== undefined) {
    const company = typeof data.company === 'string' ? data.company.trim() : '';
    if (!company) {
      errors.company = 'Company name is required';
    } else if (company.length > 100) {
      errors.company = 'Company name cannot exceed 100 characters';
    }
  }

  if (!isUpdate || data.source !== undefined) {
    if (!data.source) {
      errors.source = 'Lead source is required';
    } else if (!LEAD_SOURCES.includes(data.source)) {
      errors.source = `Source must be one of: ${LEAD_SOURCES.join(', ')}`;
    }
  }

  if (data.status !== undefined && !LEAD_STATUSES.includes(data.status)) {
    errors.status = `Status must be one of: ${LEAD_STATUSES.join(', ')}`;
  }

  return errors;
};

const validateCreateLead = (req, res, next) => {
  const errors = validateLeadFields(req.body, false);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
  next();
};

const validateUpdateLead = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide at least one field to update',
    });
  }

  const errors = validateLeadFields(req.body, true);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
  next();
};

module.exports = {
  validateObjectId,
  validateCreateLead,
  validateUpdateLead,
};