const express = require('express')
const router = express.Router()
const { protect, adminOnly } = require('../middleware/authMiddleware')
const {
    checkExpiringSubscriptions,
    getExpiringVenues,
    renewSubscription,
    getExpirationStats
} = require('../controllers/subscriptionExpirationController')

// Admin only routes
router.post('/check', protect, adminOnly, checkExpiringSubscriptions)
router.get('/expiring', protect, adminOnly, getExpiringVenues)
router.post('/renew', protect, adminOnly, renewSubscription)
router.get('/stats', protect, adminOnly, getExpirationStats)

module.exports = router
