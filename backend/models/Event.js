const mongoose = require("mongoose")
const eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },

    artist: {
        type: String,
        required: true,
    },

    venue: {
        type: String,
        required: true,
    },
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    image: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },

    time: {
        type: String,
        required: true,
    },

    featured: {
        type: Boolean,
        default: false,
    }
}, { 
    timestamps: true,
})

module.exports = mongoose.model("Event", eventSchema)
