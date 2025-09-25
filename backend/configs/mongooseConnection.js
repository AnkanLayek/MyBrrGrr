const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI

mongoose.connect(mongoUri)
.then(() => {
    console.log("Connected to database")
})
.catch((err) => {
    console.log(err)
})

module.exports = mongoose.connection;