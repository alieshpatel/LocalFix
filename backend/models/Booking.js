const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  
  scheduledDate: { type: Date, required: true },
  address: { type: String, required: true },
  problemDescription: { type: String, required: true },
  problemImage: { type: String },
  price: { type: Number, default: 0 },
  
  status: {
    type: String,
    enum: ["pending", "quoted", "accepted", "in-progress", "completed", "cancelled"],
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