const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// =======================
// CORS CONFIG (PRODUCTION FIX)
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://blog-platform-gold-rho.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow tools like Postman or server-to-server requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// ❌ DO NOT USE app.options("*", cors()) in Node 24+
// (this was causing Render crash)

// =======================
// Middleware
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// Routes
// =======================
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// =======================
// Health Check Route
// =======================
app.get("/", (req, res) => {
  res.send("Blog Backend is Running 🚀");
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});