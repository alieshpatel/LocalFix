const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
  serviceRequestId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"ServiceRequest",
    required:true
  },

  customerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  technicianId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  amount:{ type:Number, required:true },

  paymentMethod:{
    type:String,
    enum:["cash","upi","card","netbanking"],
    default:"cash"
  },

  paymentStatus:{
    type:String,
    enum:["PENDING","PAID","FAILED"],
    default:"PENDING"
  }

},
{timestamps:true}
);

module.exports = mongoose.model("Payment", paymentSchema);