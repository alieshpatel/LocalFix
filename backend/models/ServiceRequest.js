const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
{
  customerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  technicianId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:null
  },
  serviceType:{
    type:String,
    enum:["plumbing","electrical","appliance_service","general_maintenance"],
    required:true
  },
  description:String,

  serviceAddress:{
    street:String,
    city:String,
    state:String,
    pincode:String
  },

  status:{
    type:String,
    enum:["REQUESTED","ASSIGNED","IN_PROGRESS","COMPLETED","CANCELLED"],
    default:"REQUESTED"
  }

},
{timestamps:true}
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);