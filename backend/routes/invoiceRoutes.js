const express = require('express')
const router = express.Router()
const { protect, adminOnly } = require('../middleware/authMiddleware')
const {
    createInvoice,
    getAllInvoices,
    getInvoice,
    updateInvoiceStatus,
    sendReminder,
    getInvoiceStats
} = require('../controllers/invoiceController')

// Admin only routes
router.post('/', protect, adminOnly, createInvoice)
router.get('/', protect, adminOnly, getAllInvoices)
router.get('/stats/overview', protect, adminOnly, getInvoiceStats)
router.get('/:id', protect, adminOnly, getInvoice)
router.put('/:id/status', protect, adminOnly, updateInvoiceStatus)
router.post('/:id/reminder', protect, adminOnly, sendReminder)

module.exports = router
