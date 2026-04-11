// Load environment variables (.env file se data load karta hai)
require("dotenv").config();

// Import required packages
const express = require("express"); // backend server banane ke liye
const mongoose = require("mongoose"); // MongoDB connect karne ke liye
const rateLimit = require("express-rate-limit"); // security (limit requests)

// Import routes
const userRoutes = require("./routes/userRoutes");

// Create express app
const app = express();

// Middleware: JSON data read karne ke liye (req.body use karne ke liye zaroori)
app.use(express.json());


// 🔥 Rate Limiting (security)
// Ek user kitni requests bhej sakta hai limit karte hain (DDoS / spam se bachne ke liye)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes time window
  max: 100, // ek IP se max 100 requests allowed
  message: "Too many requests, please try again later",
});

// Apply rate limiter to all requests
app.use(limiter);


// 🔌 MongoDB Connection
// .env file se connection string le raha hai
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));


// 🧪 Test route (check server running or not)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// 🔗 Routes connect kar rahe hain
// Ab jo bhi request /api/users pe aayegi wo userRoutes handle karega
app.use("/api/users", userRoutes);


// 🚀 Server start
// Port 5000 pe backend run karega
app.listen(5000, () => {
  console.log("Server started on port 5000");
});