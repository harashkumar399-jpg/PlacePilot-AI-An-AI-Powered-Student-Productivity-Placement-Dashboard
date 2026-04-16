// Load environment variables (.env file se values load hoti hain)
require("dotenv").config();

// Required packages import
const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

// Routes import
const userRoutes = require("./routes/userRoutes");

// Express app create
const app = express();


// =====================================================
// CORS Middleware
// Frontend (React) ko backend access allow karega
// =====================================================
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);


// =====================================================
// JSON Middleware
// req.body use karne ke liye
// =====================================================
app.use(express.json());


// =====================================================
// Rate Limiter
// Spam / too many requests se protection
// =====================================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // ek IP se max 100 request
  message: "Too many requests, please try again later",
});

// Apply globally
app.use(limiter);


// =====================================================
// MongoDB Connection
// =====================================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));


// =====================================================
// Test Route
// =====================================================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// =====================================================
// Main Routes
// =====================================================
app.use("/api/users", userRoutes);


// =====================================================
// Server Start
// =====================================================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});