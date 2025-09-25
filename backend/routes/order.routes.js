const express = require("express")
const { createOrder, getOrders, editOrder } = require("../controllers/orderController")
const route = express.Router()

route.post("/create", createOrder)
route.post("/edit", editOrder)
route.get("/getOrders", getOrders)

module.exports = route