const Reservation = require('../models/Reservation');
const Venue = require('../models/Venue');
const { sendReservationEmail } = require('../services/emailService');

const createReservation = async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        const savedReservation = await reservation.save();
        
        // Fetch venue name for email
        const venue = await Venue.findById(req.body.venue);
        const venueName = venue ? venue.name : "VibraAddis Venue";
        
        // Generate a mock booking reference (frontend also generates one, but let's just create a generic one here for the email)
        const bookingRef = "VIBRA-" + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        // Send email in background (don't await so we don't slow down response)
        sendReservationEmail(req.body, venueName, bookingRef);

        res.status(201).json(savedReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVenueReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ venue: req.params.venueId }).sort({ date: 1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReservation,
    getVenueReservations
};
