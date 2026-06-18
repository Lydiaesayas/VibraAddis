const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['nightclub', 'traditional Cultural Restaurant'],
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            default: 4.5,
        },
        featured: {
            type:Boolean,
            default: false, 
        },

        tags: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
        },
        coordinates: {
            lat: { type: Number, default: 9.0300 }, // Default near central Addis
            lng: { type: Number, default: 38.7400 },
        },
        vibeStatus: {
            type: String,
            enum: ['Chill', 'Crowded', 'Energetic', 'Live Band', 'Closed'],
            default: 'Chill',
        },
        website: {
            type: String,
        },
        video: {
            type: String,
        },
        gallery: {
            type: [String],
            default: [],
        },
        socialPosts: [{
            platform: { type: String, enum: ['instagram', 'tiktok', 'facebook', 'unknown'] },
            type: { type: String, enum: ['reel', 'post', 'story', 'video', 'link'] },
            url: String,
            externalId: String,
        }],
        instagramHandle: String,
        tiktokHandle: String,
        listingStatus: {
            type: String,
            enum: ['pending', 'active', 'expired', 'suspended'],
            default: 'active',
        },
        subscriptionPlan: {
            type: String,
            enum: ['spotlight', 'campaign', 'celebrity', 'signature', 'content', 'fomo', 'none'],
            default: 'spotlight',
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        listingExpiresAt: Date,
        expirationReminderSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

// Index for expiration queries
venueSchema.index({ listingExpiresAt: 1, listingStatus: 1 });

module.exports = mongoose.model('Venue', venueSchema)
