require("dotenv").config()
const mongoose = require("mongoose")
const connectDB = require("./config/db")
const Event = require("./models/Event")
const seedEvents = async () => {
    try {
        await connectDB()
        await Event.deleteMany()
        await Event.insertMany([
            {
                title: "Afrobeat Night",
                artist: "DJ Cj",
                venue: "Luxx Addis",
                image: "https://images.unsplash.com/photo-1514933651103-005eec06c7a0",
                description: "Biggest Afrobeat party in town with DJ Cj spinning the hottest Afrobeat tracks. Join us for an unforgettable night of dancing and great vibes at Luxx Addis.",
                date: new Date("2026-05-08"),
                time: "10:00 PM",
                featured: true,
            },
            {
                title: "Traditional Dance Show",
                artist: "Habesha Dance Troupe",
                venue: "Yod Abyssinia",
                image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
                description: "Authentic Ethiopian traditional dance performance by the renowned Habesha Dance Troupe. Experience the rich culture and vibrant energy of Ethiopia through mesmerizing dance and music at Yod Abyssinia.",
                date: new Date("2026-05-09"),
                time: "8:00 PM",
                featured: true,
            },
            {
                title: "Rooftop Vibes",
                artist: "DJ sky",
                venue: "Pandora Addis",
                image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
                description: "Enjoy the best rooftop vibes in Addis Ababa with DJ Sky. Dance under the stars and take in the stunning city views while grooving to a mix of international and local hits at Pandora Addis.",
                date: new Date("2026-05-10"),
                time: "9:00 PM",
            }
        ])
        console.log("Events seeded successfully")
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
seedEvents()
    