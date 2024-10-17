const fs = require('fs');
const model = require('../model/user')
const mongoose = require('mongoose');
const User = model.user;



exports.createUser = (req, res) => {  
  const user = new User(req.body);
  console.log(user);
  user.save();
  res.status(201).json(user);
};

exports.getAllUsers = async (req, res) => {
  console.log("getAllUsers");
  const user = await User.find({}); 
  res.json(user);
};

exports.getUser = async (req, res) => {
  const id = req.params.id;
  console.log({id})
  console.log("getAllUsers");
  const user = await User.findById(id);
  res.json(user);

  
};
exports.replaceUser = async  (req, res) => {
  console.log("replaceUser it call by put method it delete all other data and change given data");
  const id = req.params.id;
  try{
  const doc = await User.findOneAndReplace({_id:id},req.body,{new:true})
  res.status(201).json({"replaceUser":doc});
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }

};

exports.updateUser =async  (req, res) => { 
  console.log(" it call by patch method it change exist data other all are remain same as old");
  const id = req.params.id;
  try{
  const doc = await User.findOneAndUpdate({_id:id},req.body,{new:true})
  res.status(201).json({"updateUser":doc});
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }

};
exports.deleteUser = async (req, res) => {  
  const id = req.params.id;
  console.log({id})
  try{
  const doc = await User.findOneAndDelete({_id:id})
  res.status(201).json({"delete" :doc});
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
};