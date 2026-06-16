const ListingSubscription = require('../models/ListingSubscription');
const Venue = require('../models/Venue');

const PLANS = [
    {
        id: 'spotlight',
        step: 1,
        title: 'Spotlight Listing',
        tagline: 'Get on the map',
        price: '15,000 ETB / month',
        features: [
            'Venue profile on VibraAddis',
            'Search & category placement',
            'Basic photo gallery',
            'Customer reviews enabled',
        ],
    },
    {
        id: 'campaign',
        step: 2,
        title: '2-Week Campaign',
        tagline: 'Turn one night into two weeks of hype',
        price: '35,000 ETB / event',
        features: [
            'Everything in Spotlight',
            '10-day teaser countdown',
            '5-day aggressive reels push',
            '2-day urgency & FOMO posts',
            'Event-night live coverage',
        ],
    },
    {
        id: 'celebrity',
        step: 3,
        title: 'Celebrity Night Branding',
        tagline: 'Host the biggest nights in Addis',
        price: '50,000 ETB / month',
        features: [
            'Featured homepage placement',
            'Celebrity night promotion',
            'Priority explore ranking',
            'Brand story on About page',
        ],
    },
    {
        id: 'signature',
        step: 4,
        title: 'Signature Events',
        tagline: 'Build recurring iconic nights',
        price: '40,000 ETB / month',
        features: [
            'Custom event series branding',
            'Weekly event calendar slots',
            'Push notifications to favorites',
            'Signature night badges',
        ],
    },
    {
        id: 'content',
        step: 5,
        title: 'Cinematic Content',
        tagline: '20–40 content pieces per night',
        price: '60,000 ETB / night',
        features: [
            'Professional videographer',
            'Reel creator on-site',
            'Photographer coverage',
            'Content uploaded to your profile',
        ],
    },
    {
        id: 'fomo',
        step: 6,
        title: 'VIP FOMO Package',
        tagline: 'Everyone important was there — except me',
        price: '85,000 ETB / month',
        features: [
            'Full strategy from steps 1–5',
            'Viral moment planning',
            'VIP birthday & bottle show promos',
            'Reels feed priority + social push',
            'Dedicated account manager',
        ],
    },
];

const getPlans = (req, res) => {
    res.json(PLANS);
};

const createSubscriptionRequest = async (req, res, next) => {
    try {
        const { venueName, contactName, email, phone, planId, message } = req.body;

        if (!venueName || !contactName || !email || !phone || !planId) {
            res.status(400);
            throw new Error('Please fill in all required fields');
        }

        const plan = PLANS.find((p) => p.id === planId);
        if (!plan) {
            res.status(400);
            throw new Error('Invalid subscription plan');
        }

        const subscription = await ListingSubscription.create({
            venueName,
            contactName,
            email,
            phone,
            planId,
            message: message || '',
        });

        res.status(201).json({
            message: 'Subscription request submitted. Our team will contact you within 24 hours.',
            subscription,
        });
    } catch (error) {
        next(error);
    }
};

const getSubscriptionRequests = async (req, res, next) => {
    try {
        const subscriptions = await ListingSubscription.find().sort({ createdAt: -1 });
        res.json(subscriptions);
    } catch (error) {
        next(error);
    }
};

const updateSubscriptionRequest = async (req, res, next) => {
    try {
        const { status, adminNotes } = req.body;
        const subscription = await ListingSubscription.findById(req.params.id);

        if (!subscription) {
            res.status(404);
            throw new Error('Subscription request not found');
        }

        if (status) subscription.status = status;
        if (adminNotes !== undefined) subscription.adminNotes = adminNotes;

        if (status === 'approved' || status === 'active') {
            let venue = await Venue.findOne({
                name: { $regex: new RegExp(`^${subscription.venueName.trim()}$`, 'i') },
            });

            if (!venue) {
                venue = await Venue.create({
                    name: subscription.venueName,
                    category: 'nightclub',
                    location: 'Addis Ababa',
                    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796',
                    listingStatus: 'active',
                    subscriptionPlan: subscription.planId,
                    isPublished: true,
                    listingExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                });
            } else {
                venue.listingStatus = 'active';
                venue.subscriptionPlan = subscription.planId;
                venue.isPublished = true;
                venue.listingExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                await venue.save();
            }

            subscription.venue = venue._id;
            subscription.status = 'active';
        }

        await subscription.save();
        res.json(subscription);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPlans,
    createSubscriptionRequest,
    getSubscriptionRequests,
    updateSubscriptionRequest,
    PLANS,
};
