const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, default: "" },
  phone: { type: String, default: "" },
  role: {
    type: String,
    enum: ["customer", "provider", "pending"],
    default: "pending"
  },
  // Provider specific fields
  bio: {
    type: String,
    default: ""
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  skills: [{
    type: String
  }],
  experienceYears: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  reliabilityScore: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);