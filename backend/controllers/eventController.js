const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 10, featured } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { artist: { $regex: search, $options: 'i' } },
                { venue: { $regex: search, $options: 'i' } }
            ];
        }

        if (featured === 'true') {
            query.featured = true;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const events = await Event.find(query)
            .sort({ date: 1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Event.countDocuments(query);

        res.json({
            events,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            res.status(404);
            throw new Error('Event not found');
        }
        res.json(event);
    } catch (error) {
        next(error);
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private (Admin)
const createEvent = async (req, res, next) => {
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        next(error);
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Admin)
const updateEvent = async (req, res, next) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedEvent) {
            res.status(404);
            throw new Error('Event not found');
        }
        res.json(updatedEvent);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            res.status(404);
            throw new Error('Event not found');
        }
        await event.deleteOne();
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
