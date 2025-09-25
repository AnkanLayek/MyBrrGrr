const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: Buffer,
    role: {
        type: String,
        default: 'user',
        immutable: true
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order"
        }
    ]
})

module.exports = mongoose.model("user", userModel);