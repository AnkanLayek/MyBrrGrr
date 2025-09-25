const express = require('express');
const { createPaymentOrder, verifyPayment } = require('../controllers/razorpayController');

const route = express.Router();

route.post("/createOrder", createPaymentOrder);
route.post("/verifyPayment", verifyPayment);

module.exports = route;