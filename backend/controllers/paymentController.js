const Payment = require("../models/Payment");

exports.createPayment = async(req,res)=>{
  try{

    const payment = new Payment(req.body);
    await payment.save();

    res.status(201).json(payment);

  }catch(err){
    res.status(400).json({error:err.message});
  }
};

exports.getPayments = async(req,res)=>{
  const payments = await Payment.find();
  res.json(payments);
};