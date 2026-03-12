const ServiceRequest = require("../models/ServiceRequest");

exports.createService = async(req,res)=>{
  try{

    const service = new ServiceRequest(req.body);
    await service.save();

    res.status(201).json(service);

  }catch(err){
    res.status(400).json({error:err.message});
  }
};

exports.getServices = async(req,res)=>{
  try{

    const services = await ServiceRequest.find()
    .populate("customerId","name")
    .populate("technicianId","name");

    res.json(services);

  }catch(err){
    res.status(500).json({error:err.message});
  }
};