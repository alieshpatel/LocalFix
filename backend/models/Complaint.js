const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
{
  serviceRequestId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"ServiceRequest"
  },

  customerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  subject:String,
  description:String,

  status:{
    type:String,
    enum:["OPEN","IN_REVIEW","RESOLVED","CLOSED"],
    default:"OPEN"
  }

},
{timestamps:true}
);

module.exports = mongoose.model("Complaint", complaintSchema);