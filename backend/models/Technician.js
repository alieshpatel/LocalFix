const mongoose = require("mongoose");

const technicianSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  skills: [{
    type: String,
    enum: ["plumbing","electrical","appliance_service","general_maintenance"]
  }],
  experienceYears: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  reliabilityScore: { type: Number, default: 5 },
  totalJobsCompleted: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 }
},
{ timestamps:true }
);

module.exports = mongoose.model("Technician", technicianSchema);