const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  role:String
},{timestamps:true});

userSchema.pre("save", async function(next){

  if(!this.isModified("password")){
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});

userSchema.methods.matchPassword = async function(password){
  return await bcrypt.compare(password,this.password);
};

module.exports = mongoose.model("User",userSchema);