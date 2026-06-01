const express = require('express');
const router = express.Router();
const { createReservation, getVenueReservations } = require('../controllers/reservationController');

router.post('/', createReservation);
router.get('/:venueId', getVenueReservations);

module.exports = router;
