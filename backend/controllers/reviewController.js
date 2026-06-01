const Review = require('../models/Review');
const Venue = require('../models/Venue');

// Add a review
const addReview = async (req, res) => {
    try {
        const { venueId, userName, rating, comment } = req.body;

        const review = new Review({
            venue: venueId,
            userName,
            rating,
            comment
        });

        const savedReview = await review.save();

        // Update Venue average rating (simplified logic)
        const reviews = await Review.find({ venue: venueId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        
        await Venue.findByIdAndUpdate(venueId, { rating: avgRating.toFixed(1) });

        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reviews for a venue
const getVenueReviews = async (req, res) => {
    try {
        const { venueId } = req.params;
        const reviews = await Review.find({ venue: venueId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addReview,
    getVenueReviews
};
