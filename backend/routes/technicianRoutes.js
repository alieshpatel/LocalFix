const express = require("express");
const router = express.Router();
const Technician = require("../models/Technician");

router.post("/", async (req,res)=>{
  const tech = new Technician(req.body);
  await tech.save();
  res.json(tech);
});

router.get("/", async (req,res)=>{
  const techs = await Technician.find().populate("userId");
  res.json(techs);
});

module.exports = router;