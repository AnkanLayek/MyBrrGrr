const express = require('express');
const { userRegister } = require('../controllers/userController');

const route = express.Router();

route.post("/register", userRegister);

module.exports = route;