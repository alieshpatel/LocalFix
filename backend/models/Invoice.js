const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  breakdown: [{
    description: String,
    cost: Number
  }],
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  paidAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
