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
