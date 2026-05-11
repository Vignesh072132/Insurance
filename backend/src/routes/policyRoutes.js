const express = require('express');
const {
  createPolicy,
  getPolicies,
  getPolicy,
  updatePolicy,
  deletePolicy
} = require('../controllers/policyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getPolicies)
  .post(protect, authorize('admin', 'agent'), createPolicy);

router.route('/:id')
  .get(protect, getPolicy)
  .put(protect, authorize('admin', 'agent'), updatePolicy)
  .delete(protect, authorize('admin'), deletePolicy);

module.exports = router;
