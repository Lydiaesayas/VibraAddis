const express = require('express')
const router = express.Router()
const { protect, adminOnly } = require('../middleware/authMiddleware')
const {
    initializePayment,
    verifyPayment,
    getPayment,
    getAllPayments,
    getPaymentStats,
    refundPayment
} = require('../controllers/paymentController')

// Public routes (for payment gateway callbacks)
router.post('/verify', verifyPayment)

// Protected routes
router.post('/initialize', protect, initializePayment)
router.get('/:id', protect, getPayment)

// Admin only routes
router.get('/', protect, adminOnly, getAllPayments)
router.get('/stats/overview', protect, adminOnly, getPaymentStats)
router.post('/:id/refund', protect, adminOnly, refundPayment)

module.exports = router
