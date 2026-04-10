
// Load environment variables from .env file
require("dotenv").config();

// Import required packages
const mongoose = require("mongoose");
const express = require("express");

// Import required packages
const userRoutes = require("./routes/userRoutes");

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));
  
  // Middleware to parse JSON data (req.body use karne ke liye zaroori)
app.use(express.json());

// test route (check server running or not)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
// User routes connect kar rahe hain main app se
// Ab /api/users/register endpoint kaam karega
app.use("/api/users", userRoutes);

// server start
app.listen(5000, () => {
  console.log("Server started on port 5000");
});

