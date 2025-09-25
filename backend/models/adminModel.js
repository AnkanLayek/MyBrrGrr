const mongoose = require('mongoose');

const adminModel = mongoose.Schema({
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
        default: 'admin',
        immutable: true
    }
})

module.exports = mongoose.model("admin", adminModel);