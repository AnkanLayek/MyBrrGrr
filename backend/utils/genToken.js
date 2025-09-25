const jwt = require('jsonwebtoken');

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const genToken = (user) => {
    return jwt.sign({email: user.email, id: user._id, role: user.role}, jwtSecretKey);
}

module.exports = genToken;