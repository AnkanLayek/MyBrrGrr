const express = require('express');
const { createItem, editItem, deleteItem, getItems } = require('../controllers/itemController');

const route = express.Router();

route.post("/create", createItem);
route.post("/edit", editItem);
route.get("/getItems/:_id?", getItems);
route.delete("/delete", deleteItem);

module.exports = route;