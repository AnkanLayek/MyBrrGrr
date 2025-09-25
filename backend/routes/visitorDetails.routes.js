const express = require('express');
const { getVisitorDetails } = require('../controllers/visitorDetailsController');

const route = express.Router();

route.get("/get", getVisitorDetails);

module.exports = route;