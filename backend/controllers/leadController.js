const { Lead, LEAD_STATUSES } = require('../models/Lead');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get all leads (with search, status filter, sorting, and pagination)
// @route   GET /api/leads
const getLeads = async (req, res, next) => {
  try {
    const {
      search = '',
      status = 'All',
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (search.trim()) {
      const safeRegex = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [
        { name: safeRegex },
        { email: safeRegex },
        { company: safeRegex },
      ];
    }

    if (status && status !== 'All' && LEAD_STATUSES.includes(status)) {
      filter.status = status;
    }

    const allowedSortFields = ['createdAt', 'name', 'company', 'status'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead counts grouped by status (for dashboard cards)
// @route   GET /api/leads/stats
const getLeadStats = async (req, res, next) => {
  try {
    const grouped = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      total: 0,
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Lost: 0,
    };

    grouped.forEach(({ _id, count }) => {
      if (_id in stats) {
        stats[_id] = count;
      }
      stats.total += count;
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, source, status } = req.body;

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim(),
      source,
      status: status || 'New',
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing lead
// @route   PUT /api/leads/:id
const updateLead = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'email', 'phone', 'company', 'source', 'status'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] =
          typeof req.body[field] === 'string'
            ? req.body[field].trim()
            : req.body[field];
      }
    });

    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id: lead._id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  getLeadStats,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};