const mongoose = require('mongoose');

const ingredientModel = mongoose.Schema({
    ingredientName: {
        type: String,
        required: true
    },
    ingredientQuantity: {
        type: Number,
        default: 0
    },
    ingredientUnit: {
        type: String,
        default: 'unit'
    },
    ingredientQuantityPerBurger: {
        type: Number,
        default: 1
    },
    ingredientPrice: {
        type: Number,
        default: 0
    },
    ingredientState: {
        type: String,
        enum: ['existing', 'deleted'],
        default: 'existing'
    }
})

module.exports = mongoose.model("ingredient", ingredientModel)