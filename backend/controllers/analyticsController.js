const Venue = require('../models/Venue');
const ListingSubscription = require('../models/ListingSubscription');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const Event = require('../models/Event');

// Get overall dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Venue statistics
        const totalVenues = await Venue.countDocuments();
        const activeVenues = await Venue.countDocuments({ listingStatus: 'active', isPublished: true });
        const pendingVenues = await Venue.countDocuments({ listingStatus: 'pending' });
        
        // Subscription statistics
        const totalSubscriptions = await ListingSubscription.countDocuments();
        const activeSubscriptions = await ListingSubscription.countDocuments({ status: 'active' });
        const pendingSubscriptions = await ListingSubscription.countDocuments({ status: 'pending' });

        // Payment statistics
        const totalPayments = await Payment.countDocuments();
        const completedPayments = await Payment.countDocuments({ paymentStatus: 'completed' });
        const pendingPayments = await Payment.countDocuments({ paymentStatus: 'pending' });

        // Revenue
        const totalRevenue = await Payment.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // User statistics
        const totalUsers = await User.countDocuments();

        // Event statistics
        const totalEvents = await Event.countDocuments();
        const upcomingEvents = await Event.countDocuments({ date: { $gte: new Date() } });

        // Invoice statistics
        const totalInvoices = await Invoice.countDocuments();
        const paidInvoices = await Invoice.countDocuments({ status: 'paid' });
        const overdueInvoices = await Invoice.countDocuments({ 
            status: 'sent',
            dueDate: { $lt: new Date() }
        });

        res.json({
            venues: {
                total: totalVenues,
                active: activeVenues,
                pending: pendingVenues
            },
            subscriptions: {
                total: totalSubscriptions,
                active: activeSubscriptions,
                pending: pendingSubscriptions
            },
            payments: {
                total: totalPayments,
                completed: completedPayments,
                pending: pendingPayments,
                totalRevenue: totalRevenue[0]?.total || 0
            },
            users: {
                total: totalUsers
            },
            events: {
                total: totalEvents,
                upcoming: upcomingEvents
            },
            invoices: {
                total: totalInvoices,
                paid: paidInvoices,
                overdue: overdueInvoices
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get revenue by month
const getRevenueByMonth = async (req, res) => {
    try {
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

        res.json(revenueByMonth);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get subscription trends
const getSubscriptionTrends = async (req, res) => {
    try {
        const trends = await ListingSubscription.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    total: { $sum: 1 },
                    active: {
                        $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                    },
                    pending: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
        ]);

        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get venue performance
const getVenuePerformance = async (req, res) => {
    try {
        const performance = await Venue.aggregate([
            { $match: { isPublished: true } },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'venue',
                    as: 'reviews'
                }
            },
            {
                $project: {
                    name: 1,
                    category: 1,
                    rating: 1,
                    subscriptionPlan: 1,
                    listingStatus: 1,
                    reviewCount: { $size: '$reviews' },
                    featured: 1
                }
            },
            { $sort: { rating: -1 } },
            { $limit: 20 }
        ]);

        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user growth
const getUserGrowth = async (req, res) => {
    try {
        const growth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
        ]);

        res.json(growth);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getRevenueByMonth,
    getSubscriptionTrends,
    getVenuePerformance,
    getUserGrowth
};
