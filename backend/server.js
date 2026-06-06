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
// CORS CONFIG (FIXED)
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://blog-platform-gold-rho.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS not allowed"), false);
    }

    return callback(null, true);
  },
  credentials: true
}));

app.options("*", cors());

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
// Test route
// =======================
app.get("/", (req, res) => {
  res.send("Blog Backend is Running 🚀");
});

// =======================
// Start server
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});