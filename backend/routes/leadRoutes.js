const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLeadStats,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} = require('../controllers/leadController');
const {
  validateObjectId,
  validateCreateLead,
  validateUpdateLead,
} = require('../middleware/validateLead');

// Keep /stats above /:id so Express does not treat "stats" as an ID
router.get('/stats', getLeadStats);

router.route('/').get(getLeads).post(validateCreateLead, createLead);

router
  .route('/:id')
  .get(validateObjectId, getLeadById)
  .put(validateObjectId, validateUpdateLead, updateLead)
  .delete(validateObjectId, deleteLead);

module.exports = router;