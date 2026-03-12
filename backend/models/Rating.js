const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
{
  serviceRequestId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"ServiceRequest"
  },

  customerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  technicianId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  rating:{
    type:Number,
    min:1,
    max:5
  },

  feedback:String

},
{timestamps:true}
);

module.exports = mongoose.model("Rating", ratingSchema);