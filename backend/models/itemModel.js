const mongoose = require('mongoose');

const itemModel = mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    itemDescription: {
        type: String
    },
    ingredients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ingredient'
        }
    ],
    itemPrice: {
        type: Number,
        default: 0
    },
    itemPic: Buffer,
    itemState: {
        type: String,
        enum: ['existing', 'deleted'],
        default: 'existing'
    }
})

module.exports = mongoose.model("item", itemModel)