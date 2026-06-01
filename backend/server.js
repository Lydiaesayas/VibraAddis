const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const authRoutes = require("./routes/authRoutes")
require("dotenv").config()

const connectDB = require("./config/db")
const venueRoutes = require("./routes/venueRoutes")
const eventRoutes = require("./routes/eventRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const reservationRoutes = require("./routes/reservationRoutes")
const { errorHandler } = require('./middleware/errorMiddleware')

const path = require("path")

const app = express()

connectDB()

app.use(helmet({
  crossOriginResourcePolicy: false
}))
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes"
})

// Apply the rate limiting middleware to API calls only
app.use("/api/", apiLimiter)

app.use("/api/auth", authRoutes)
app.use("/api/venues", venueRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/reservations", reservationRoutes)
app.get("/test", (req, res) => {
  res.send("Test route working")
})

app.get("/", (req, res) => {
  res.send("VibraAddict API  running")
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})