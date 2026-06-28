const Payment = require('../models/Payment');
const ListingSubscription = require('../models/ListingSubscription');
const crypto = require('crypto');

// Generate transaction ID
const generateTransactionId = () => {
    return `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

// Initialize payment
const initializePayment = async (req, res) => {
    try {
        const { subscriptionId, paymentMethod } = req.body;

        // Get subscription details
        const subscription = await ListingSubscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        // Get plan details
        const { getPlans } = require('./subscriptionController');
        const plans = getPlans();
        const plan = plans.find(p => p.id === subscription.planId);
        
        if (!plan) {
            return res.status(400).json({ message: 'Invalid plan' });
        }

        // Parse amount from plan price (e.g., "15,000 ETB / month" -> 15000)
        const amount = parseInt(plan.price.replace(/[^0-9]/g, ''));

        // Create payment record
        const payment = await Payment.create({
            subscriptionId,
            venueId: subscription.venue,
            amount,
            currency: 'ETB',
            paymentMethod,
            paymentStatus: 'pending',
            transactionId: generateTransactionId(),
            notes: `Payment for ${plan.title} plan`
        });

        // In production, this would call the actual payment gateway API
        // For now, we'll return a mock payment initiation response
        res.json({
            paymentId: payment._id,
            transactionId: payment.transactionId,
            amount: payment.amount,
            currency: payment.currency,
            paymentMethod: payment.paymentMethod,
            // Mock payment gateway response
            paymentGatewayUrl: `https://mock-payment-gateway.com/pay/${payment.transactionId}`,
            expiresIn: 900 // 15 minutes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify payment (callback from payment gateway)
const verifyPayment = async (req, res) => {
    try {
        const { transactionId, paymentGatewayResponse } = req.body;

        // Find payment by transaction ID
        const payment = await Payment.findOne({ transactionId });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // In production, this would verify with the actual payment gateway
        // For now, we'll simulate successful payment verification
        payment.paymentStatus = 'completed';
        payment.paymentGatewayResponse = paymentGatewayResponse;
        payment.paidAt = new Date();
        await payment.save();

        // Update subscription status
        const subscription = await ListingSubscription.findById(payment.subscriptionId);
        if (subscription) {
            subscription.status = 'active';
            await subscription.save();
        }

        res.json({
            paymentId: payment._id,
            transactionId: payment.transactionId,
            paymentStatus: payment.paymentStatus,
            invoiceNumber: payment.invoiceNumber,
            paidAt: payment.paidAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get payment by ID
const getPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('subscriptionId')
            .populate('venueId');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all payments (admin)
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('subscriptionId')
            .populate('venueId')
            .sort({ createdAt: -1 });

        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get payment statistics
const getPaymentStats = async (req, res) => {
    try {
        const totalPayments = await Payment.countDocuments();
        const completedPayments = await Payment.countDocuments({ paymentStatus: 'completed' });
        const pendingPayments = await Payment.countDocuments({ paymentStatus: 'pending' });
        const failedPayments = await Payment.countDocuments({ paymentStatus: 'failed' });

        const totalRevenue = await Payment.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const revenueByMonth = await Payment.aggregate([
            { $match: { paymentStatus: 'completed' } },
            {
                $group: {
                    _id: {
                        year: { $year: '$paidAt' },
                        month: { $month: '$paidAt' }
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
        ]);

        res.json({
            totalPayments,
            completedPayments,
            pendingPayments,
            failedPayments,
            totalRevenue: totalRevenue[0]?.total || 0,
            revenueByMonth
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Refund payment
const refundPayment = async (req, res) => {
    try {
        const { reason } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        if (payment.paymentStatus !== 'completed') {
            return res.status(400).json({ message: 'Only completed payments can be refunded' });
        }

        // In production, this would call the payment gateway's refund API
        payment.paymentStatus = 'refunded';
        payment.notes = reason || 'Refunded by admin';
        await payment.save();

        // Update subscription status
        const subscription = await ListingSubscription.findById(payment.subscriptionId);
        if (subscription) {
            subscription.status = 'cancelled';
            await subscription.save();
        }

        res.json({ message: 'Payment refunded successfully', payment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Initialize event payment
const initializeEventPayment = async (req, res) => {
    try {
        const { eventId, paymentMethod } = req.body;
        const Event = require('../models/Event');

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Set fixed fee for event publishing (e.g., 500 ETB)
        const amount = 500;

        const payment = await Payment.create({
            eventId,
            amount,
            currency: 'ETB',
            paymentMethod,
            paymentStatus: 'pending',
            transactionId: generateTransactionId(),
            notes: `Payment for publishing event: ${event.title}`
        });

        res.json({
            paymentId: payment._id,
            transactionId: payment.transactionId,
            amount: payment.amount,
            currency: payment.currency,
            paymentMethod: payment.paymentMethod,
            paymentGatewayUrl: `https://mock-payment-gateway.com/pay/${payment.transactionId}`,
            expiresIn: 900
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify event payment
const verifyEventPayment = async (req, res) => {
    try {
        const { transactionId, paymentGatewayResponse } = req.body;

        const payment = await Payment.findOne({ transactionId });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.paymentStatus = 'completed';
        payment.paymentGatewayResponse = paymentGatewayResponse;
        payment.paidAt = new Date();
        await payment.save();

        const Event = require('../models/Event');
        const event = await Event.findById(payment.eventId);
        if (event) {
            event.paymentStatus = 'completed';
            await event.save();
        }

        res.json({
            paymentId: payment._id,
            transactionId: payment.transactionId,
            paymentStatus: payment.paymentStatus,
            invoiceNumber: payment.invoiceNumber,
            paidAt: payment.paidAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    initializePayment,
    verifyPayment,
    initializeEventPayment,
    verifyEventPayment,
    getPayment,
    getAllPayments,
    getPaymentStats,
    refundPayment
};
