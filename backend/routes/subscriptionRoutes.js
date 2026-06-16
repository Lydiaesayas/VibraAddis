const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getPlans,
    createSubscriptionRequest,
    getSubscriptionRequests,
    updateSubscriptionRequest,
} = require('../controllers/subscriptionController');

router.get('/plans', getPlans);
router.post('/request', createSubscriptionRequest);
router.get('/', protect, getSubscriptionRequests);
router.patch('/:id', protect, updateSubscriptionRequest);

module.exports = router;
