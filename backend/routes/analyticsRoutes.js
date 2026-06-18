const express = require('express')
const router = express.Router()
const { protect, adminOnly } = require('../middleware/authMiddleware')
const {
    getDashboardStats,
    getRevenueByMonth,
    getSubscriptionTrends,
    getVenuePerformance,
    getUserGrowth
} = require('../controllers/analyticsController')

// Admin only routes
router.get('/dashboard', protect, adminOnly, getDashboardStats)
router.get('/revenue/monthly', protect, adminOnly, getRevenueByMonth)
router.get('/subscriptions/trends', protect, adminOnly, getSubscriptionTrends)
router.get('/venues/performance', protect, adminOnly, getVenuePerformance)
router.get('/users/growth', protect, adminOnly, getUserGrowth)

module.exports = router
