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
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Venue', venueSchema)
