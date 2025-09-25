const bcrypt = require('bcrypt');

const adminModel = require("../models/adminModel");
const genToken = require('../utils/genToken');

const saltRound = parseInt(process.env.SALT_ROUND, 10);

class adminController {
    async adminRegister(req, res){
        try{
            const { fullName, username, email, password } = req.body;

            if((!fullName) || (fullName == '')){
                return res.status(400).json({message: 'Full name is required'});    // 400: Bad request
            }
            if((!username) || (username == '')){
                return res.status(400).json({message: 'Username is required'});    // 400: Bad request
            }
            if((!email) || (email == '')){
                return res.status(400).json({message: 'Email is required'});    // 400: Bad request
            }
            if((!password) || (password == '')){
                return res.status(400).json({message: 'Password is required'});    // 400: Bad request
            }
    
            const emailExists = await adminModel.findOne({email});
            if(emailExists){
                return res.status(409).json({message: 'This email is already registered. Try another'});    // 409: Conflict
            }
    
            const usernameExists = await adminModel.findOne({username});
            if(usernameExists){
                return res.json({message: 'This username is already registered. Try another'});    // 409: Conflict
            }
    
            const salt = await bcrypt.genSalt(saltRound);
            const hash = await bcrypt.hash(password, salt);
    
            const createdAdmin = await adminModel.create({
                fullName,
                username,
                email,
                password: hash
            })
    
            if(createdAdmin){
                const sentAdmin = await adminModel.findOne({email: createdAdmin.email}).select("-password");

                const token = genToken(sentAdmin);
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
                });

                return res.status(201).json({message:"Admin registered successfully", admin: sentAdmin});    // 201: Created
            }
            return res.status(500).json({message: "Failed to register"});    // 500: Internal server error

        } catch(error){
            return res.status(500).json({message: "Internal Server Error", error: error});    // 500: Internal server error
        }
    }
}

module.exports = new adminController();