const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, default: "" },
  phone: { type: String, default: "" },
  role: {
    type: String,
    enum: ["customer", "provider", "admin"],
    default: "customer"
  },
  // Provider specific fields
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