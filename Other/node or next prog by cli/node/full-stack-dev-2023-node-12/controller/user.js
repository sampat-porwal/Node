const fs = require('fs');
const model = require('../model/user')
const mongoose = require('mongoose');
const User = model.User;



// (createUser)it no need here it in auth controller with signUp name
exports.createUser = (req, res) => {  
  const user = new User(req.body);
  console.log(user);
  
  //user.save();
  user.save((err, doc) => {
    console.log({ err, doc });
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(201).json({user});
    }
  });
  
  
};
// (createUser)it no need here it in auth controller with signUp name

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.getUser = async (req, res) => {
  const id = req.params.id;
  console.log({id})
  const user = await User.findById(id).populate('cart');
  res.json(user);
};
exports.replaceUser = async (req, res) => {
  const id = req.params.id;
  try{
  const doc = await User.findOneAndReplace({_id:id},req.body,{new:true})
  res.status(201).json(doc);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
};
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  try{
  const doc = await User.findOneAndUpdate({_id:id},req.body,{new:true})
  res.status(201).json(doc);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
};
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try{
  const doc = await User.findOneAndDelete({_id:id})
  res.status(201).json(doc);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
};

