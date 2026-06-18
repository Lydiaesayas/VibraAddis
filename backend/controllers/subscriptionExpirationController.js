const Venue = require('../models/Venue');
const ListingSubscription = require('../models/ListingSubscription');
const Invoice = require('../models/Invoice');

// Check for expiring subscriptions (should be run daily via cron job)
const checkExpiringSubscriptions = async (req, res) => {
    try {
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Find venues expiring in the next 7 days
        const expiringSoon = await Venue.find({
            listingStatus: 'active',
            listingExpiresAt: { $lte: sevenDaysFromNow, $gte: now },
            expirationReminderSent: false
        });

        // Find venues that have already expired
        const expired = await Venue.find({
            listingStatus: 'active',
            listingExpiresAt: { $lt: now }
        });

        // Process expiring soon venues
        for (const venue of expiringSoon) {
            // Mark reminder as sent
            venue.expirationReminderSent = true;
            await venue.save();

            // In production, this would send an email notification
            console.log(`Expiration reminder sent for venue: ${venue.name}, expires: ${venue.listingExpiresAt}`);
        }

        // Process expired venues
        for (const venue of expired) {
            venue.listingStatus = 'expired';
            venue.isPublished = false;
            await venue.save();

            console.log(`Venue expired: ${venue.name}`);
        }

        res.json({
            message: 'Subscription expiration check completed',
            expiringSoon: expiringSoon.length,
            expired: expired.length,
            expiringSoonVenues: expiringSoon,
            expiredVenues: expired
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get venues with expiring subscriptions
const getExpiringVenues = async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const expiringVenues = await Venue.find({
            listingStatus: 'active',
            listingExpiresAt: { $lte: thirtyDaysFromNow, $gte: now }
        }).sort({ listingExpiresAt: 1 });

        res.json(expiringVenues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Renew subscription
const renewSubscription = async (req, res) => {
    try {
        const { venueId, planId, durationMonths } = req.body;

        const venue = await Venue.findById(venueId);
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        // Calculate new expiration date
        const baseDate = venue.listingExpiresAt && venue.listingExpiresAt > new Date() 
            ? venue.listingExpiresAt 
            : new Date();
        const newExpirationDate = new Date(baseDate);
        newExpirationDate.setMonth(newExpirationDate.getMonth() + (durationMonths || 1));

        venue.listingExpiresAt = newExpirationDate;
        venue.listingStatus = 'active';
        venue.isPublished = true;
        venue.subscriptionPlan = planId;
        venue.expirationReminderSent = false;
        await venue.save();

        // Update subscription if exists
        const subscription = await ListingSubscription.findOne({ venue: venueId });
        if (subscription) {
            subscription.status = 'active';
            subscription.planId = planId;
            await subscription.save();
        }

        res.json({
            message: 'Subscription renewed successfully',
            venue,
            newExpirationDate
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get subscription expiration statistics
const getExpirationStats = async (req, res) => {
    try {
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const expiringIn7Days = await Venue.countDocuments({
            listingStatus: 'active',
            listingExpiresAt: { $lte: sevenDaysFromNow, $gte: now }
        });

        const expiringIn30Days = await Venue.countDocuments({
            listingStatus: 'active',
            listingExpiresAt: { $lte: thirtyDaysFromNow, $gte: now }
        });

        const alreadyExpired = await Venue.countDocuments({
            listingStatus: 'expired'
        });

        const activeVenues = await Venue.countDocuments({
            listingStatus: 'active',
            listingExpiresAt: { $gte: now }
        });

        res.json({
            expiringIn7Days,
            expiringIn30Days,
            alreadyExpired,
            activeVenues
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    checkExpiringSubscriptions,
    getExpiringVenues,
    renewSubscription,
    getExpirationStats
};
