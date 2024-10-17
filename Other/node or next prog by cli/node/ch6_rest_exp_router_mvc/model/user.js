const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {type: String, required: true} ,
    description: String,
    phone: String,
    firstName: String,
    lastName: String,     
    age:String,
    gender: String
   
  });
  
exports.user = mongoose.model('users', userSchema);