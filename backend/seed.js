require("dotenv").config()

const mongoose = require("mongoose")
const connectDB = require("./config/db")
const Venue = require("./models/Venue")

const venues = [
  {
    name: "Hashtag Club",
    category: "nightclub",
    location: "Bole Medhanialem, Addis Ababa",
    image: "https://images.unsplash.com/photo-1545128485-c400e7702796",
    video: "https://assets.mixkit.co/videos/preview/mixkit-crowd-in-front-of-a-dj-at-a-club-party-10901-large.mp4",
    rating: 4.8,
    featured: true,
    tags: ["Elite", "Afrobeat", "VIP", "Trendy"],
    description: "Hashtag Club is the epicenter of elite nightlife in Addis Ababa. Featuring state-of-the-art lighting, premium bottle service, and an energetic crowd, it's where the city's trendsetters gather for unforgettable nights. Soundtrack curated by top local and international DJs.",
    coordinates: { lat: 9.0010, lng: 38.7850 },
    vibeStatus: "Energetic",
    website: "https://hashtagclubaddis.com",
    gallery: [
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67",
      "https://images.unsplash.com/photo-1574169208507-84376144848b",
      "https://images.unsplash.com/photo-1544785316-6e58aed68a50"
    ]
  },
  {
    name: "Black Pearl Lounge",
    category: "nightclub",
    location: "Bole Atlas, Addis Ababa",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2",
    video: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-in-a-nightclub-34538-large.mp4",
    rating: 4.6,
    featured: true,
    tags: ["Lounge", "Cocktails", "RnB", "Chic"],
    description: "Sophisticated and chic, Black Pearl Lounge offers a premium nightlife experience with bespoke cocktails, intimate seating, and a flawless mix of RnB and Afropop. The perfect venue for a stylish night out or private corporate celebrations.",
    coordinates: { lat: 9.0085, lng: 38.7825 },
    vibeStatus: "Chill",
    website: "https://blackpearllounge.et",
    gallery: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629"
    ]
  },
  {
    name: "The Platinum",
    category: "nightclub",
    location: "Kazanchis, Addis Ababa",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    video: "https://assets.mixkit.co/videos/preview/mixkit-dj-mixer-with-flashing-colorful-lights-in-a-club-34614-large.mp4",
    rating: 4.9,
    featured: true,
    tags: ["Luxury", "Live DJ", "Exclusive", "High-Energy"],
    description: "The Platinum sets the gold standard for Addis nightlife. Boasting an expansive dance floor, world-class sound system, and unparalleled VIP services, this exclusive venue hosts the city's most spectacular events and performances.",
    coordinates: { lat: 9.0150, lng: 38.7650 },
    vibeStatus: "Crowded",
    website: "https://platinumclubaddis.com",
    gallery: [
      "https://images.unsplash.com/photo-1558369178-6441b4a9235f",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      "https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3"
    ]
  },
  {
    name: "Gold City Lounge",
    category: "nightclub",
    location: "Bole, Edna Mall Area, Addis Ababa",
    image: "https://images.unsplash.com/photo-1470229722913-7c092fbdd7f6",
    video: "https://assets.mixkit.co/videos/preview/mixkit-people-in-a-concert-enjoying-the-music-14476-large.mp4",
    rating: 4.7,
    featured: false,
    tags: ["Rooftop", "Ambiance", "HipHop", "Upscale"],
    description: "Gold City Lounge combines a luxurious modern aesthetic with a vibrant social atmosphere. Enjoy panoramic city views, signature drinks, and a premium auditory experience tailored for young professionals and business executives.",
    coordinates: { lat: 8.9955, lng: 38.7885 },
    vibeStatus: "Energetic",
    gallery: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
      "https://images.unsplash.com/photo-1545128485-c400e7702796",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec"
    ]
  },
  {
    name: "VIP Club",
    category: "nightclub",
    location: "Piassa, Addis Ababa",
    image: "https://images.unsplash.com/photo-1558369178-6441b4a9235f",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-in-a-club-34543-large.mp4",
    rating: 4.5,
    featured: true,
    tags: ["Classic", "High-End", "Dance", "Premium"],
    description: "A legendary name in Addis Ababa's nightlife, VIP Club offers an authentic and thrilling clubbing experience. Featuring luxurious interiors, a massive dance floor, and a curated lineup of top DJs playing the best of global beats.",
    coordinates: { lat: 9.0320, lng: 38.7520 },
    vibeStatus: "Crowded",
    website: "https://vipclubaddis.com",
    gallery: [
      "https://images.unsplash.com/photo-1576525865260-9f0e7cfb02b3",
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20",
      "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2"
    ]
  },
  {
    name: "2000 Habesha Lounge",
    category: "traditional Cultural Restaurant",
    location: "Bole Atlas Area, Addis Ababa",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34b4",
    video: "https://assets.mixkit.co/videos/preview/mixkit-people-having-dinner-at-a-restaurant-4458-large.mp4",
    rating: 4.5,
    featured: false,
    tags: ["Traditional Food", "Live Dance", "Cultural Show"],
    description: "Excellent spot for authentic Ethiopian cuisine served with live traditional music and colorful dance shows representing various Ethiopian ethnic groups.",
    coordinates: { lat: 9.0080, lng: 38.7820 },
    vibeStatus: "Live Band",
    gallery: [
      "https://images.unsplash.com/photo-1414235077428-33898dd18d8e",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34b4"
    ]
  },
  {
    name: "Yod Abyssinia",
    category: "traditional Cultural Restaurant",
    location: "Bole, Haile Gebresilassie Avenue, Addis Ababa",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    video: "https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-having-dinner-and-drinking-wine-4475-large.mp4",
    rating: 4.6,
    featured: true,
    tags: ["Cultural Dance", "Traditional Food", "Live Music", "Tourist Favorite"],
    description: "One of the most popular cultural restaurants in Addis Ababa offering authentic Ethiopian food and energetic traditional dance performances from various regions of Ethiopia.",
    coordinates: { lat: 9.0120, lng: 38.7850 },
    vibeStatus: "Crowded",
    website: "https://yodabyssinia.com",
    gallery: [
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1"
    ]
  }
];

const seedData = async () => {
    try {
        await connectDB()
        await Venue.deleteMany({})
        await Venue.insertMany(venues)
        console.log("Data seeded successfully")
        process.exit()
    } catch (error) {
        console.log( error)
        process.exit(1)
    }
}
seedData()