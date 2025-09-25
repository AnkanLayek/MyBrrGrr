const express = require('express')
const { visitorLogin, visitorLogout } = require('../controllers/loginController')

const route = express.Router()

route.post("/in", visitorLogin)
route.post("/out", visitorLogout)

module.exports = route