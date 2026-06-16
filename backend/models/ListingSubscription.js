const mongoose = require('mongoose');

const listingSubscriptionSchema = new mongoose.Schema(
    {
        venueName: { type: String, required: true },
        contactName: { type: String, required: true },
        email: { type: String, required: true, lowercase: true },
        phone: { type: String, required: true },
        planId: {
            type: String,
            enum: ['spotlight', 'campaign', 'celebrity', 'signature', 'content', 'fomo'],
            required: true,
        },
        message: { type: String, default: '' },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'active', 'expired'],
            default: 'pending',
        },
        adminNotes: { type: String, default: '' },
        venue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Venue',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('ListingSubscription', listingSubscriptionSchema);
