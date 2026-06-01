const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        venue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Venue',
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Review', reviewSchema);
