const Venue = require('../models/Venue');

// @desc    Get all venues for an owner
// @route   GET /api/venues/owner/my-venues
// @access  Private
const getMyVenues = async (req, res, next) => {
    try {
        const venues = await Venue.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(venues);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all venues for admin (includes unpublished)
// @route   GET /api/venues/admin/all
// @access  Private
const getAllVenuesAdmin = async (req, res, next) => {
    try {
        const venues = await Venue.find().sort({ createdAt: -1 });
        res.json({ venues, total: venues.length });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reels feed (social posts from published venues)
// @route   GET /api/venues/reels/feed
// @access  Public
const getReelsFeed = async (req, res, next) => {
    try {
        const venues = await Venue.find({
            isPublished: true,
            listingStatus: 'active',
            'socialPosts.0': { $exists: true },
        }).select('name category location rating description image socialPosts subscriptionPlan');

        const feed = [];
        const seen = new Set();

        venues.forEach((venue) => {
            venue.socialPosts.forEach((post) => {
                const key = `${post.platform}:${post.externalId}`;
                if (seen.has(key)) return;
                seen.add(key);

                feed.push({
                    _id: `${venue._id}-${post.externalId}`,
                    venueId: venue._id,
                    venueName: venue.name,
                    category: venue.category,
                    location: venue.location,
                    rating: venue.rating,
                    description: venue.description,
                    image: venue.image,
                    platform: post.platform,
                    type: post.type,
                    url: post.url,
                    externalId: post.externalId,
                });
            });
        });

        res.json(feed);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public
const getVenues = async (req, res, next) => {
    try {
        const { search, category, rating, page = 1, limit = 10, ids } = req.query;
        let query = {
            isPublished: true,
            listingStatus: 'active',
        };

        // Filter by specific IDs
        if (ids) {
            query._id = { $in: ids.split(',') };
        }

        // Search by name or location
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by category
        if (category && category.toLowerCase() !== 'all') {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        // Filter by minimum rating
        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        const parsedLimit = ids ? ids.split(',').length : Number(limit);
        const skip = (Number(page) - 1) * parsedLimit;

        const venues = await Venue.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parsedLimit);

        const total = await Venue.countDocuments(query);

        res.json({
            venues,
            page: Number(page),
            pages: Math.ceil(total / parsedLimit),
            total
        });
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};

// @desc    Get single venue
// @route   GET /api/venues/:id
// @access  Public
const getVenueById = async (req, res, next) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            res.status(404);
            throw new Error('Venue not found');
        }
        res.json(venue);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a venue
// @route   POST /api/venues
// @access  Private (Admin)
const createVenue = async (req, res, next) => {
    try {
        if (req.file) {
            req.body.image = req.file.path; // Cloudinary URL
        }
        
        if (req.body.tags && typeof req.body.tags === 'string') {
            try {
                req.body.tags = JSON.parse(req.body.tags);
            } catch (e) {
                // Ignore parse errors, it might just be a comma separated string
            }
        }
        
        const newVenue = new Venue(req.body);
        const savedVenue = await newVenue.save();
        res.status(201).json(savedVenue);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a venue
// @route   PUT /api/venues/:id
// @access  Private (Admin)
const updateVenue = async (req, res, next) => {
    try {
        if (req.file) {
            req.body.image = req.file.path;
        }

        if (req.body.tags && typeof req.body.tags === 'string') {
            try {
                req.body.tags = JSON.parse(req.body.tags);
            } catch (e) {}
        }

        const updatedVenue = await Venue.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedVenue) {
            res.status(404);
            throw new Error('Venue not found');
        }
        res.json(updatedVenue);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a venue
// @route   DELETE /api/venues/:id
// @access  Private (Admin)
const deleteVenue = async (req, res, next) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            res.status(404);
            throw new Error('Venue not found');
        }
        await venue.deleteOne();
        res.json({ message: "Venue deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getVenues,
    getAllVenuesAdmin,
    getMyVenues,
    getVenueById,
    getReelsFeed,
    createVenue,
    updateVenue,
    deleteVenue
};
