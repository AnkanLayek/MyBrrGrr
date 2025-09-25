const express = require('express');
const { adminRegister } = require('../controllers/adminController');

const route = express.Router();

route.post("/register", adminRegister);

module.exports = route;