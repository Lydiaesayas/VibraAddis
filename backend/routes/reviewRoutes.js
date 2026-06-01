const express = require('express');
const router = express.Router();
const { addReview, getVenueReviews } = require('../controllers/reviewController');

router.post('/', addReview);
router.get('/:venueId', getVenueReviews);

module.exports = router;
