const express = require('express');
const router = express.Router();
const {
    getVenues,
    getAllVenuesAdmin,
    getMyVenues,
    getVenueById,
    getReelsFeed,
    createVenue,
    updateVenue,
    deleteVenue
} = require('../controllers/venueController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/reels/feed', getReelsFeed);
router.get('/admin/all', protect, getAllVenuesAdmin);
router.get('/owner/my-venues', protect, getMyVenues);

router.route('/')
    .get(getVenues)
    .post(protect, upload.single('image'), createVenue);

router.route('/:id')
    .get(getVenueById)
    .put(protect, upload.single('image'), updateVenue)
    .delete(protect, deleteVenue);

module.exports = router;
