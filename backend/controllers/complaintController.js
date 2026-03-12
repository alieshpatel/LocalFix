const Complaint = require("../models/Complaint");

exports.createComplaint = async(req,res)=>{
  try{

    const complaint = new Complaint(req.body);
    await complaint.save();

    res.status(201).json(complaint);

  }catch(err){
    res.status(400).json({error:err.message});
  }
};

exports.getComplaints = async(req,res)=>{
  const complaints = await Complaint.find();
  res.json(complaints);
};