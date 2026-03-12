const Rating = require("../models/Rating");

exports.createRating = async(req,res)=>{
  try{

    const rating = new Rating(req.body);
    await rating.save();

    res.status(201).json(rating);

  }catch(err){
    res.status(400).json({error:err.message});
  }
};

exports.getRatings = async(req,res)=>{
  const ratings = await Rating.find();
  res.json(ratings);
};