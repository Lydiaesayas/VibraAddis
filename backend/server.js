const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

// Import routes
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const venueRoutes = require("./routes/venueRoutes");
const eventRoutes = require("./routes/eventRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const subscriptionExpirationRoutes = require("./routes/subscriptionExpirationRoutes");
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration (with your frontend and mobile Capacitor URLs)
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://localhost', 
    'capacitor://localhost', 
    'https://vibraaddis-1.onrender.com', 
    'https://vibraaddis-2.onrender.com'
  ],
  credentials: true
}));

// Security & Middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));
app.use("/api/payments", paymentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/subscriptions/expiration", subscriptionExpirationRoutes);

// Test routes
app.get("/test", (req, res) => {
  res.send("Test route working");
});

app.get("/", (req, res) => {
  res.send("VibraAddis API is running 🚀");
});

// Error handler (should be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});