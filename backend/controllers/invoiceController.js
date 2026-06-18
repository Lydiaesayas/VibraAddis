const Invoice = require('../models/Invoice');
const ListingSubscription = require('../models/ListingSubscription');
const Payment = require('../models/Payment');
const { getPlans } = require('./subscriptionController');

// Create invoice from subscription
const createInvoice = async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        const subscription = await ListingSubscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        const plans = getPlans();
        const plan = plans.find(p => p.id === subscription.planId);
        
        if (!plan) {
            return res.status(400).json({ message: 'Invalid plan' });
        }

        // Parse amount from plan price
        const amount = parseInt(plan.price.replace(/[^0-9]/g, ''));

        // Calculate due date (30 days from issue date)
        const issueDate = new Date();
        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + 30);

        const invoice = await Invoice.create({
            subscriptionId,
            venueId: subscription.venue,
            venueName: subscription.venueName,
            contactName: subscription.contactName,
            contactEmail: subscription.email,
            contactPhone: subscription.phone,
            planId: subscription.planId,
            planName: plan.title,
            amount,
            currency: 'ETB',
            status: 'sent',
            issueDate,
            dueDate,
            items: [{
                description: `${plan.title} - ${plan.tagline}`,
                quantity: 1,
                unitPrice: amount,
                total: amount
            }],
            subtotal: amount,
            total: amount,
            notes: `Thank you for choosing VibraAddis. This invoice covers your ${plan.title} subscription.`
        });

        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all invoices (admin)
const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('subscriptionId')
            .populate('venueId')
            .populate('paymentId')
            .sort({ createdAt: -1 });

        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get invoice by ID
const getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('subscriptionId')
            .populate('venueId')
            .populate('paymentId');

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update invoice status
const updateInvoiceStatus = async (req, res) => {
    try {
        const { status, paymentId } = req.body;
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        invoice.status = status;

        if (status === 'paid') {
            invoice.paidDate = new Date();
            if (paymentId) {
                invoice.paymentId = paymentId;
            }
        }

        await invoice.save();
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send payment reminder
const sendReminder = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        if (invoice.status === 'paid') {
            return res.status(400).json({ message: 'Invoice is already paid' });
        }

        invoice.reminderSent = true;
        invoice.reminderCount += 1;
        await invoice.save();

        // In production, this would send an actual email
        // For now, we'll just return success
        res.json({ 
            message: 'Reminder sent successfully', 
            invoice,
            note: 'In production, this would send an email to ' + invoice.contactEmail
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get invoice statistics
const getInvoiceStats = async (req, res) => {
    try {
        const totalInvoices = await Invoice.countDocuments();
        const paidInvoices = await Invoice.countDocuments({ status: 'paid' });
        const pendingInvoices = await Invoice.countDocuments({ status: 'sent' });
        const overdueInvoices = await Invoice.countDocuments({ 
            status: 'sent',
            dueDate: { $lt: new Date() }
        });

        const totalRevenue = await Invoice.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const pendingRevenue = await Invoice.aggregate([
            { $match: { status: 'sent' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        res.json({
            totalInvoices,
            paidInvoices,
            pendingInvoices,
            overdueInvoices,
            totalRevenue: totalRevenue[0]?.total || 0,
            pendingRevenue: pendingRevenue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoice,
    updateInvoiceStatus,
    sendReminder,
    getInvoiceStats
};
