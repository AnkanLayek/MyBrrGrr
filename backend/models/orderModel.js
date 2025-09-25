const mongoose = require('mongoose');

const orderModel = mongoose.Schema({
    orderName: {
        type: String,
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "item"
    },
    noOfItems: {
        type: Number
    },
    orderIngredients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ingredient'
        }
    ],
    orderIngredientsQuantities: {
        type: Object
    },
    orderMessage: {
        type: String
    },
    orderPrice: {
        type: Number
    },
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    paymentType: {
        type: String,
        enum: ['online', 'onTable'],
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['unseen', 'active', 'delivered', 'cancelled'],
        default: 'unseen'
    }
}, {timestamps: true})

module.exports = mongoose.model("order", orderModel)