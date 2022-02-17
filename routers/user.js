const express = require('express');
const userController = require('../controller/user.controller');

const route = express.Router();

//createuser
route.post('/user', userController.createUser);

//loginuser
route.post('/user/login', userController.loginUser);

//View authenticated user
route.get('/user/self', userController.viewUser);

//Update authenticated user
route.put('/user/self', userController.updateUser);


module.exports = route;


