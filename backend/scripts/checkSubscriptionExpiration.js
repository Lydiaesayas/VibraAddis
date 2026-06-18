require('dotenv').config();
const mongoose = require('mongoose');
const Venue = require('../models/Venue');
const ListingSubscription = require('../models/ListingSubscription');
const { sendExpirationWarning, sendPaymentReminder } = require('../services/emailService');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibraaddis');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

// Check for expiring subscriptions
const checkExpiringSubscriptions = async () => {
    try {
        console.log('Starting subscription expiration check...');
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Find venues expiring in the next 7 days
        const expiringSoon = await Venue.find({
            listingStatus: 'active',
            listingExpiresAt: { $lte: sevenDaysFromNow, $gte: now },
            expirationReminderSent: false
        }).populate('subscriptionPlan');

        // Find venues that have already expired
        const expired = await Venue.find({
            listingStatus: 'active',
            listingExpiresAt: { $lt: now }
        });

        console.log(`Found ${expiringSoon.length} venues expiring soon`);
        console.log(`Found ${expired.length} venues already expired`);

        // Process expiring soon venues
        for (const venue of expiringSoon) {
            try {
                // Get subscription details for email
                const subscription = await ListingSubscription.findOne({ venue: venue._id });
                
                if (subscription) {
                    // Send expiration warning email
                    const emailSent = await sendExpirationWarning({
                        venueName: venue.name,
                        contactName: subscription.contactName,
                        contactEmail: subscription.email,
                        listingExpiresAt: venue.listingExpiresAt
                    });
                    
                    if (emailSent) {
                        console.log(`Expiration warning sent for venue: ${venue.name}`);
                    }
                }

                // Mark reminder as sent
                venue.expirationReminderSent = true;
                await venue.save();
            } catch (error) {
                console.error(`Error processing venue ${venue.name}:`, error);
            }
        }

        // Process expired venues
        for (const venue of expired) {
            try {
                venue.listingStatus = 'expired';
                venue.isPublished = false;
                await venue.save();
                console.log(`Venue expired: ${venue.name}`);
            } catch (error) {
                console.error(`Error expiring venue ${venue.name}:`, error);
            }
        }

        // Check for overdue invoices
        const Invoice = require('../models/Invoice');
        const overdueInvoices = await Invoice.find({
            status: 'sent',
            dueDate: { $lt: now },
            reminderCount: { $lt: 3 }
        });

        console.log(`Found ${overdueInvoices.length} overdue invoices`);

        for (const invoice of overdueInvoices) {
            try {
                const emailSent = await sendPaymentReminder({
                    invoiceNumber: invoice.invoiceNumber,
                    contactName: invoice.contactName,
                    contactEmail: invoice.contactEmail,
                    planName: invoice.planName,
                    amount: invoice.amount,
                    currency: invoice.currency,
                    dueDate: invoice.dueDate
                });

                if (emailSent) {
                    invoice.reminderSent = true;
                    invoice.reminderCount += 1;
                    await invoice.save();
                    console.log(`Payment reminder sent for invoice: ${invoice.invoiceNumber}`);
                }
            } catch (error) {
                console.error(`Error processing invoice ${invoice.invoiceNumber}:`, error);
            }
        }

        console.log('Subscription expiration check completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error in subscription expiration check:', error);
        process.exit(1);
    }
};

// Run the check
const run = async () => {
    await connectDB();
    await checkExpiringSubscriptions();
};

run();
