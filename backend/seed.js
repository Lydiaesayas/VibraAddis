require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Venue = require("./models/Venue");
const socialPostData = require("./data/socialPosts");
const { parseSocialUrl, handleToVenueName, normalizeVenueName } = require("./utils/socialUrl");

const baseVenues = [
  {
    name: "Password Lounge",
    category: "nightclub",
    location: "Bole, Addis Ababa",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67",
    video: "https://assets.mixkit.co/videos/preview/mixkit-crowd-in-front-of-a-dj-at-a-club-party-10901-large.mp4",
    rating: 4.9,
    featured: true,
    tags: ["VIP", "Celebrity", "Luxury", "FOMO"],
    description: "Password Lounge hosts the biggest celebrity nights in Addis Ababa. Premium bottle service, cinematic content, and unmatched energy every weekend.",
    coordinates: { lat: 9.0050, lng: 38.7840 },
    vibeStatus: "Energetic",
    instagramHandle: "passwordloungeaddis",
    subscriptionPlan: "fomo",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Black Rose Lounge",
    category: "nightclub",
    location: "Bole Atlas, Addis Ababa",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2",
    video: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-in-a-nightclub-34538-large.mp4",
    rating: 4.7,
    featured: true,
    tags: ["Lounge", "RnB", "Chic", "Rooftop"],
    description: "Black Rose Lounge delivers sophisticated nights with bespoke cocktails, live DJs, and an upscale crowd.",
    coordinates: { lat: 9.0085, lng: 38.7825 },
    vibeStatus: "Chill",
    tiktokHandle: "blackroselounge",
    instagramHandle: "blackroselounge",
    subscriptionPlan: "content",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "The Cage Addis",
    category: "nightclub",
    location: "Kazanchis, Addis Ababa",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    video: "https://assets.mixkit.co/videos/preview/mixkit-dj-mixer-with-flashing-colorful-lights-in-a-club-34614-large.mp4",
    rating: 4.8,
    featured: true,
    tags: ["High-Energy", "Live DJ", "Crowded", "Trendy"],
    description: "The Cage Addis is known for high-energy weekends, surprise celebrity appearances, and viral crowd moments.",
    coordinates: { lat: 9.0150, lng: 38.7650 },
    vibeStatus: "Crowded",
    instagramHandle: "thecageaddis",
    subscriptionPlan: "celebrity",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Hashtag Club",
    category: "nightclub",
    location: "Bole Medhanialem, Addis Ababa",
    image: "https://images.unsplash.com/photo-1545128485-c400e7702796",
    video: "https://assets.mixkit.co/videos/preview/mixkit-crowd-in-front-of-a-dj-at-a-club-party-10901-large.mp4",
    rating: 4.8,
    featured: true,
    tags: ["Elite", "Afrobeat", "VIP", "Trendy"],
    description: "Hashtag Club is the epicenter of elite nightlife in Addis Ababa.",
    coordinates: { lat: 9.0010, lng: 38.7850 },
    vibeStatus: "Energetic",
    subscriptionPlan: "campaign",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Black Pearl Lounge",
    category: "nightclub",
    location: "Bole Atlas, Addis Ababa",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    rating: 4.6,
    featured: true,
    tags: ["Lounge", "Cocktails", "RnB", "Chic"],
    description: "Sophisticated and chic, Black Pearl Lounge offers premium nightlife with bespoke cocktails.",
    coordinates: { lat: 9.0088, lng: 38.7830 },
    vibeStatus: "Chill",
    subscriptionPlan: "spotlight",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "The Platinum",
    category: "nightclub",
    location: "Kazanchis, Addis Ababa",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    rating: 4.9,
    featured: true,
    tags: ["Luxury", "Live DJ", "Exclusive"],
    description: "The Platinum sets the gold standard for Addis nightlife.",
    coordinates: { lat: 9.0145, lng: 38.7660 },
    vibeStatus: "Crowded",
    subscriptionPlan: "signature",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Gold City Lounge",
    category: "nightclub",
    location: "Bole, Edna Mall Area, Addis Ababa",
    image: "https://images.unsplash.com/photo-1470229722913-7c092fbdd7f6",
    rating: 4.7,
    featured: false,
    tags: ["Rooftop", "Ambiance", "HipHop"],
    description: "Gold City Lounge combines luxury with panoramic city views.",
    coordinates: { lat: 8.9955, lng: 38.7885 },
    vibeStatus: "Energetic",
    subscriptionPlan: "spotlight",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "VIP Club",
    category: "nightclub",
    location: "Piassa, Addis Ababa",
    image: "https://images.unsplash.com/photo-1558369178-6441b4a9235f",
    rating: 4.5,
    featured: true,
    tags: ["Classic", "High-End", "Dance"],
    description: "A legendary name in Addis Ababa nightlife with a massive dance floor.",
    coordinates: { lat: 9.0320, lng: 38.7520 },
    vibeStatus: "Crowded",
    subscriptionPlan: "spotlight",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Yod Abyssinia",
    category: "traditional Cultural Restaurant",
    location: "Bole, Haile Gebresilassie Avenue, Addis Ababa",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    rating: 4.6,
    featured: true,
    tags: ["Cultural Dance", "Traditional Food", "Live Music"],
    description: "Popular cultural restaurant with authentic Ethiopian food and dance.",
    coordinates: { lat: 9.0120, lng: 38.7850 },
    vibeStatus: "Crowded",
    subscriptionPlan: "spotlight",
    listingStatus: "active",
    isPublished: true,
  },
];

function buildSocialPostsForVenues() {
  const venuePostsMap = new Map();
  const globalSeen = new Set();

  socialPostData.forEach((entry) => {
    const parsed = parseSocialUrl(entry.url);
    const dedupeKey = `${parsed.platform}:${parsed.externalId}`;
    if (globalSeen.has(dedupeKey)) return;
    globalSeen.add(dedupeKey);

    const venueName =
      entry.venueName ||
      handleToVenueName(parsed.handle) ||
      "Password Lounge";

    const normalized = normalizeVenueName(venueName);
    if (!venuePostsMap.has(normalized)) {
      venuePostsMap.set(normalized, []);
    }

    venuePostsMap.get(normalized).push({
      platform: parsed.platform,
      type: parsed.type,
      url: parsed.cleanUrl,
      externalId: parsed.externalId,
    });
  });

  return venuePostsMap;
}

const seedData = async () => {
  try {
    await connectDB();
    await Venue.deleteMany({});

    const postsByVenue = buildSocialPostsForVenues();
    const venuesToInsert = baseVenues.map((venue) => {
      const posts = postsByVenue.get(normalizeVenueName(venue.name)) || [];
      postsByVenue.delete(normalizeVenueName(venue.name));
      return { ...venue, socialPosts: posts };
    });

    postsByVenue.forEach((posts, normalizedName) => {
      const displayName = posts[0] ? socialPostData.find((p) =>
        normalizeVenueName(p.venueName || "") === normalizedName
      )?.venueName : normalizedName;

      venuesToInsert.push({
        name: displayName || normalizedName,
        category: "nightclub",
        location: "Addis Ababa",
        image: "https://images.unsplash.com/photo-1545128485-c400e7702796",
        rating: 4.5,
        featured: false,
        description: `${displayName || normalizedName} on VibraAddis.`,
        coordinates: { lat: 9.03, lng: 38.74 },
        vibeStatus: "Energetic",
        subscriptionPlan: "spotlight",
        listingStatus: "active",
        isPublished: true,
        socialPosts: posts,
      });
    });

    await Venue.insertMany(venuesToInsert);
    console.log(`Seeded ${venuesToInsert.length} venues with social posts`);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedData();
