const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');

const jwtSecretKey = process.env.JWT_SECRET_KEY;

class visitorDetailsController {
    async getVisitorDetails (req, res) {
        try {
            const token = req.cookies.token;

            if(!token){
                return res.status(401).json({message: "Unautherized"})
            }

            const decodedToken = jwt.verify(token, jwtSecretKey)

            let currentVisitor = null;
            if(decodedToken.role == 'user') {
                currentVisitor = await userModel.findOne({email: decodedToken.email}).select("-password")
            }
            else if(decodedToken.role == 'admin') {
                currentVisitor = await adminModel.findOne({email: decodedToken.email}).select("-password")
            }

            return res.status(200).json({message: "Visitor details fetched successfully", visitor: currentVisitor, role: decodedToken.role, authenticated: true})
        
        } catch (error) {
            return res.status(500).json({message: "Internal server error"})
        }
    }
}

module.exports = new visitorDetailsController()