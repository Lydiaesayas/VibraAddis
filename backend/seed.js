require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Venue = require("./models/Venue");
const Event = require("./models/Event");
const socialPostData = require("./data/socialPosts");
const { parseSocialUrl, handleToVenueName, normalizeVenueName } = require("./utils/socialUrl");

const baseVenues = [
  {
    name: "Password Lounge",
    category: "nightclub",
    location: "Bole, Addis Ababa",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67",
    video: "https://www.instagram.com/reel/DY5MIqPAxq0/?igsh=MWIwc3VlMTZoanR2eQ==",
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
    video: "https://www.tiktok.com/@blackroselounge/video/7640807706382667026?_r=1&u_code=ej07bhjh933hff&preview_pb=0&sharer_language=en&_d=ej07b6cc8hhm4f&share_item_id=7640807706382667026&source=h5_m&timestamp=1781260233&user_id=7473198128130556944&sec_user_id=MS4wLjABAAAAfVlsym6ANSTZJDyYMN9A29WmoPnQLbKnUHFqwnfSilqbFFBxflvUgf-Q956hYgWu&item_author_type=2&social_share_type=0&utm_source=telegram&utm_campaign=client_share&utm_medium=android&share_iid=7621080597725497096&share_link_id=54c5da6b-2539-4805-bcb5-cc21461f1eff&share_app_id=1233&ugbiz_name=MAIN&ug_btm=b2001&link_reflow_popup_iteration_sharer=%7B%22click_empty_to_play%22%3A1%2C%22dynamic_cover%22%3A1%2C%22follow_to_play_duration%22%3A-1.0%2C%22profile_clickable%22%3A1%7D&enable_checksum=1",
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
    video: "https://www.instagram.com/reel/DYrwus3iih1/?igsh=ejRjODA3amQwYW4x",
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
    video: "https://www.instagram.com/reel/DZRP5fUomFB/?igsh=MjVpMTZvZ2pjOHpk",
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
    video: "https://www.instagram.com/reel/DY9Hio5I43m/?igsh=MnU5bDRzaTFiemty",
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
    video: "https://www.instagram.com/reel/DY86A2zMGCF/?igsh=cnM3Zzc5ZnA5cHMy",
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
    video: "https://www.instagram.com/reel/DZaYexcMH3b/?igsh=NHp5MXdxOWVzZXp3",
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
    video: "https://www.instagram.com/reel/DZkuTN1M3ua/?igsh=dHl4a3d5cnh0NzZ4",
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
    video: "https://www.youtube.com/watch?v=WeeOsoVLxSM",
    rating: 4.6,
    featured: true,
    tags: ["Cultural Dance", "Traditional Food", "Live Music", "Raw Meat"],
    description: "Popular cultural restaurant with authentic Ethiopian food and dance. Famous for traditional raw meat dishes.",
    coordinates: { lat: 9.0120, lng: 38.7850 },
    vibeStatus: "Crowded",
    subscriptionPlan: "spotlight",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Habesha 2000",
    category: "traditional Cultural Restaurant",
    location: "Bole, Addis Ababa",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    video: "https://www.youtube.com/watch?v=Gd07awzoa2M",
    rating: 4.5,
    featured: true,
    tags: ["Cultural Dance", "Traditional Food", "Raw Meat", "Kitfo"],
    description: "Authentic Ethiopian cultural restaurant specializing in traditional raw meat dishes like kitfo and gored gored.",
    coordinates: { lat: 9.0100, lng: 38.7880 },
    vibeStatus: "Crowded",
    subscriptionPlan: "spotlight",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Kategna",
    category: "traditional Cultural Restaurant",
    location: "Piassa, Addis Ababa",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    video: "https://www.youtube.com/watch?v=jrrzSKo7xwE",
    rating: 4.7,
    featured: true,
    tags: ["Traditional Food", "Raw Meat", "Historic", "Cultural"],
    description: "Historic traditional restaurant known for authentic Ethiopian cuisine and premium raw meat specialties.",
    coordinates: { lat: 9.0340, lng: 38.7500 },
    vibeStatus: "Chill",
    subscriptionPlan: "content",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Four Sisters Restaurant",
    category: "traditional Cultural Restaurant",
    location: "Bole, Addis Ababa",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    video: "https://www.youtube.com/watch?v=TWBy8DoDR4Q",
    rating: 4.4,
    featured: false,
    tags: ["Traditional Food", "Raw Meat", "Family", "Authentic"],
    description: "Family-run traditional restaurant serving authentic Ethiopian dishes including raw meat specialties.",
    coordinates: { lat: 9.0090, lng: 38.7860 },
    vibeStatus: "Chill",
    subscriptionPlan: "spotlight",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Taitu Hotel",
    category: "traditional Cultural Restaurant",
    location: "Piassa, Addis Ababa",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
    video: "https://www.youtube.com/watch?v=m952dj58ZjY",
    rating: 4.3,
    featured: true,
    tags: ["Historic", "Traditional Food", "Raw Meat", "Cultural Heritage"],
    description: "Ethiopia's first hotel, featuring traditional restaurant with authentic raw meat dishes in a historic setting.",
    coordinates: { lat: 9.0350, lng: 38.7480 },
    vibeStatus: "Chill",
    subscriptionPlan: "signature",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Dashen Restaurant",
    category: "traditional Cultural Restaurant",
    location: "Kazanchis, Addis Ababa",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    video: "https://www.youtube.com/shorts/aKQH6mHb-G8",
    rating: 4.5,
    featured: false,
    tags: ["Traditional Food", "Raw Meat", "Local Favorite"],
    description: "Local favorite for traditional Ethiopian cuisine, specializing in fresh raw meat dishes.",
    coordinates: { lat: 9.0160, lng: 38.7640 },
    vibeStatus: "Crowded",
    subscriptionPlan: "spotlight",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Yeshi Buna",
    category: "traditional Cultural Restaurant",
    location: "Bole, Addis Ababa",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    video: "https://www.youtube.com/watch?v=NoUfiUtjULY",
    rating: 4.4,
    featured: false,
    tags: ["Traditional Food", "Raw Meat", "Coffee", "Cultural"],
    description: "Traditional restaurant combining Ethiopian coffee culture with authentic raw meat specialties.",
    coordinates: { lat: 9.0110, lng: 38.7840 },
    vibeStatus: "Chill",
    subscriptionPlan: "spotlight",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Wutma Restaurant",
    category: "traditional Cultural Restaurant",
    location: "Megenagna, Addis Ababa",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    video: "https://www.youtube.com/watch?v=NoUfiUtjULY",
    rating: 4.3,
    featured: false,
    tags: ["Traditional Food", "Raw Meat", "Local"],
    description: "Neighborhood traditional restaurant known for fresh raw meat and authentic Ethiopian dishes.",
    coordinates: { lat: 9.0250, lng: 38.7700 },
    vibeStatus: "Chill",
    subscriptionPlan: "spotlight",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Kuriftu Resort Restaurant",
    category: "traditional Cultural Restaurant",
    location: "Entoto, Addis Ababa",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    video: "https://www.youtube.com/watch?v=NoUfiUtjULY",
    rating: 4.6,
    featured: true,
    tags: ["Traditional Food", "Raw Meat", "Scenic", "Upscale"],
    description: "Upscale traditional restaurant with stunning views, specializing in premium raw meat dishes.",
    coordinates: { lat: 9.0450, lng: 38.7800 },
    vibeStatus: "Chill",
    subscriptionPlan: "campaign",
    listingStatus: "active",
    isPublished: true,
  },
  {
    name: "Zoma Ethiopian Restaurant",
    category: "traditional Cultural Restaurant",
    location: "Bole, Addis Ababa",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    video: "https://www.youtube.com/watch?v=NoUfiUtjULY",
    rating: 4.5,
    featured: false,
    tags: ["Traditional Food", "Raw Meat", "Artistic", "Cultural"],
    description: "Artistic traditional restaurant featuring authentic Ethiopian cuisine with focus on raw meat specialties.",
    coordinates: { lat: 9.0080, lng: 38.7870 },
    vibeStatus: "Chill",
    subscriptionPlan: "spotlight",
    listingStatus: "active",
    isPublished: true,
  },
];

const baseEvents = [
  {
    title: "TAKEOVER THURSDAYS",
    artist: "GIDAY & JA",
    venue: "Location Addis - Bole, Edna Mall (Next to Best Western Hotel)",
    image: "https://www.instagram.com/reel/DZD0QTLgRy-/?igsh=aTdkZ2p2dm1qbzh5",
    description: "Special live performances by GIDAY & JA. RSVP: 0988781858 or 0921053159",
    date: new Date("2024-06-20T21:00:00Z"),
    time: "9:00 PM",
    featured: true,
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
    await Event.deleteMany({});

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
    await Event.insertMany(baseEvents);
    console.log(`Seeded ${venuesToInsert.length} venues with social posts`);
    console.log(`Seeded ${baseEvents.length} events`);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedData();
