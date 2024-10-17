const express = require('express');
const userController = require('../controller/user');

const router = express.Router();
// here it not need beacuse create user is done by auth controller with signUp name
//post('/', userController.createUser)

router
  .post('/', userController.createUser)
  .get('/', userController.getAllUsers)
  .get('/:id', userController.getUser)
  .put('/:id', userController.replaceUser)
  .patch('/:id', userController.updateUser)
  .delete('/:id', userController.deleteUser);

exports.router = router;  