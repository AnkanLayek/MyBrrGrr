const bcrypt = require('bcrypt')

const adminModel = require("../models/adminModel");
const userModel = require("../models/userModel");
const genToken = require('../utils/genToken');

class loginController {
    async visitorLogin (req, res) {
        try {
            const {email, password} = req.body;

            if((!email) || (email == '')){
                return res.status(400).json({message: 'Email is required'});    // 400: Bad request
            }
            if((!password) || (password == '')){
                return res.status(400).json({message: 'Password is required'});    // 400: Bad request
            }

            let existingVisitor;
            existingVisitor = await adminModel.findOne({email});
            if(!existingVisitor){
                existingVisitor = await userModel.findOne({email});
            }

            if(!existingVisitor){
                return res.status(401).json({message: 'Wrong email or password'});    // 401: Unautherized
            }

            const result = await bcrypt.compare(password, existingVisitor.password);
            
            if(result){
                let sentVisitor
                if(existingVisitor.role == 'admin'){
                    sentVisitor = await adminModel.findOne({email: existingVisitor.email}).select("-password");
                }
                else if(existingVisitor.role == 'user'){
                    sentVisitor = await userModel.findOne({email: existingVisitor.email}).select("-password");
                }
                
                const token = genToken(sentVisitor);
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });

                return res.status(200).json({message:"Logged in successfully", visitor: sentVisitor});    // 200: Success
            }

            return res.status(401).json({message: 'Wrong email or password'});    // 401: Unautherized
        } catch (error) {
            return res.status(500).json({message: "Internal Server Error", error: error});    // 500: Internal server error
        }
    }

    async visitorLogout (req, res) {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
            })

            return res.status(200).json({ message: "Logged out successfully" });

        } catch (error) {
            return res.status(500).json({message: "Internal Server Error", error: error});    // 500: Internal server error
        }
    }
}

module.exports = new loginController()