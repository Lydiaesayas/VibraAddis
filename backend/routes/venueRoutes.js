const express = require('express');
const router = express.Router();
const {
    getVenues,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue
} = require('../controllers/venueController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getVenues)
    .post(protect, upload.single('image'), createVenue);

router.route('/:id')
    .get(getVenueById)
    .put(protect, upload.single('image'), updateVenue)
    .delete(protect, deleteVenue);

module.exports = router;