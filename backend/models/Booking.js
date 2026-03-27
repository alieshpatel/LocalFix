const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  
  scheduledDate: { type: Date, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  
  status: {
    type: String,
    enum: ["pending", "accepted", "in-progress", "completed", "cancelled"],
    default: "pending"
  },
  
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  
  warrantyEndsAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);