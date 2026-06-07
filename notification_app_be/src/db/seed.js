const mongoose = require("mongoose");
const User = require("../models/User");
const Notification = require("../models/Notification");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/notifications_db";

const seedData = [
  { type: "Result", title: "Mid-Term Examination", message: "mid-sem results published", createdAt: new Date("2026-04-22T17:51:30Z") },
  { type: "Placement", title: "CSX Corporation Recruitment", message: "CSX Corporation hiring drive announced", createdAt: new Date("2026-04-22T17:51:18Z") },
  { type: "Event", title: "Graduation Farewell", message: "farewell ceremony details shared", createdAt: new Date("2026-04-22T17:51:06Z") },
  { type: "Result", title: "Mid-Sem Evaluation", message: "mid-sem marks updated", createdAt: new Date("2026-04-22T17:50:54Z") },
  { type: "Result", title: "Project Evaluation", message: "project-review schedule updated", createdAt: new Date("2026-04-22T17:50:42Z") },
  { type: "Result", title: "External Viva Review", message: "external marks sheet compiled", createdAt: new Date("2026-04-22T17:50:30Z") },
  { type: "Result", title: "Project Viva Stage 2", message: "project-review final slot list", createdAt: new Date("2026-04-22T17:50:18Z") },
  { type: "Event", title: "Annual Tech Fest", message: "tech-fest event registrations open", createdAt: new Date("2026-04-22T17:50:06Z") },
  { type: "Result", title: "Project Viva Stage 1", message: "project-review review sheet uploaded", createdAt: new Date("2026-04-22T17:49:54Z") },
  { type: "Placement", title: "Advanced Micro Devices Inc. Recruitment", message: "Advanced Micro Devices Inc. hiring register slot", createdAt: new Date("2026-04-22T17:49:42Z") }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Clear existing
    await User.deleteMany({});
    await Notification.deleteMany({});

    // Create default user
    const user = await User.create({
      name: "Ram Krishna",
      email: "santoshkrishnabandla@gmail.com",
      rollNo: "2023004136"
    });
    console.log("Default User created:", user.name, "ID:", user._id);

    // Seed notifications
    const notifications = seedData.map((item) => ({
      ...item,
      userId: user._id
    }));

    await Notification.insertMany(notifications);
    console.log("Successfully seeded", notifications.length, "notifications.");

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
