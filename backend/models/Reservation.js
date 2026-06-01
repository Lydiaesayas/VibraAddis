const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
    {
        venue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Venue',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        guests: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Reservation', reservationSchema);
