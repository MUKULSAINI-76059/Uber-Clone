const userModel = require("../models/user-model")
const cookieParser = require("cookie-parser")
const {validationResult} = require("express-validator")

//Register User
async function registerUser(req, res){
    try{
        //Destructure the request body
        const {fullName: {firstName, lastName}, email, password} = req.body; 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message: "Validation failed", errors: errors.array()})
        }

        //Check if user already exists
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }
        
        //Create new user
        const user = new userModel()
        const hashedPassword = await user.hashPassword(password);

        //Save user to database
        const newUser = await userModel.create({
            fullName:{
                firstName,
                lastName:lastName || ""
            },
            email,
            password:hashedPassword
        })

        //Generate JWT token and set cookie
        await newUser.save()
        const token = newUser.generateAuthToken()
        res.cookie("token", token, {httpOnly:true, secure:true, sameSite:"strict", maxAge:3600000})
        return res.status(201).json({message: "User registered successfully", token})
        
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({message: "Internal server error"});
    }
}


//Login User
async function loginUser(req,res){
    try{
        //Destructure the request body
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        //Find user by email and select password field
        const user = await userModel.findOne({email}).select("+password")
        if(!user){
            return res.status(400).json({message: "Please enter a valid email address"})
        }

        //Compare password
        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            return res.status(400).json({message: "Invalid Password"})
        }

        //Generate JWT token and set cookie
        const token = user.generateAuthToken()
        res.cookie("token", token, {httpOnly:true, secure:true, sameSite:"strict", maxAge:3600000})
        return res.status(200).json({message: "User logged in successfully", token})
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({message: "Internal server error"});
    }
}


//Get User Profile
async function getUserProfile(req, res){
    return res.status(200).json({message: "User profile retrieved successfully", user:req.user})
    
}




module.exports = {registerUser, loginUser, getUserProfile}