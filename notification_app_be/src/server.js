const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Notification = require("./models/Notification");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/notifications_db";

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// 1. POST /evaluation-service/register (Mock Registration)
app.post("/evaluation-service/register", async (req, res) => {
  const { email, name, mobileNo, githubUsername, rollNo, accessCode } = req.body;
  
  if (!email || !rollNo) {
    return res.status(400).json({ message: "email and rollNo are required" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, rollNo });
    }
    
    // Return a mock token
    return res.status(200).json({
      message: "Registration successful",
      token: "mock_token_for_evaluation_" + user.rollNo,
      clientID: "client_" + user.rollNo,
      clientSecret: "secret_" + user.rollNo
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. GET /evaluation-service/notifications
app.get("/evaluation-service/notifications", async (req, res) => {
  const { page = 1, limit = 10, notification_type } = req.query;
  
  try {
    // Find the first default user to fetch their notifications
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ message: "No user found. Please run seed script first." });
    }

    const query = { userId: user._id };
    if (notification_type && notification_type !== "All") {
      query.type = notification_type;
    }

    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.max(1, parseInt(limit));
    const skip = (parsedPage - 1) * parsedLimit;

    // Optimized index-based lookup + sort matching Stage 3 design
    const dbNotifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit);

    // Format fields to match target remote API exactly (capitalized keys)
    const formatted = dbNotifications.map((item) => ({
      ID: item._id.toString(),
      Type: item.type,
      Message: item.message,
      Timestamp: item.createdAt.toISOString().replace(/T/, " ").replace(/\..+/, "")
    }));

    return res.status(200).json({
      notifications: formatted
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. POST /evaluation-service/logs (Logging Endpoint)
app.post("/evaluation-service/logs", (req, res) => {
  const { stack, level, package: pkg, message } = req.body;
  
  console.log(`[API Log] Stack: ${stack} | Level: ${level} | Package: ${pkg} | Msg: ${message}`);
  
  return res.status(201).json({
    logID: new mongoose.Types.ObjectId().toString(),
    message: "log created successfully"
  });
});

app.listen(PORT, () => {
  console.log(`Notification Test Backend running on port ${PORT}`);
});
