const express = require('express');
const { createIngredient, deleteIngredient, editIngredient, getIngredients } = require('../controllers/ingredientController');

const route = express.Router();

route.post("/create", createIngredient);
route.post("/edit", editIngredient);
route.get("/get", getIngredients);
route.delete("/delete", deleteIngredient);

module.exports = route;