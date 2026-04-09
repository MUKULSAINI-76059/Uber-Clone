const blacklistTokenModel = require("../models/blacklistToken-model")
const Captain = require("../models/captain-model")
const {validationResult} = require("express-validator")

async function registerCaptain(req, res){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try{
        const {fullName:{firstName, lastName}, email, password, vehicle} = req.body
        if(!firstName || !email || !password || !vehicle){
            return res.status(400).json({message: "Please fill in all required fields"})
        }
        const existingCaptain = await Captain.findOne({email})
        if(existingCaptain){
            return res.status(400).json({message: "Captain with this email already exists"})
        }
        const captain = new Captain()
        const hashedPassword = await captain.hashPassword(password)
        const normalizedLastName = typeof lastName === "string" ? lastName.trim() : undefined
        const newCaptain = await Captain.create({
            fullName:{
                firstName,
                lastName: normalizedLastName || undefined
            },
            email,
            password:hashedPassword,
            vehicle
        })

        const token = newCaptain.generateAuthToken()
        res.cookie("token", token, {httpOnly:true, secure:process.env.NODE_ENV === "production", sameSite:"strict", maxAge:3600000})
        return res.status(201).json({message: "Captain registered successfully", token})
    } catch (error) {
        console.error("Error registering captain:", error)
        return res.status(500).json({message: "An error occurred while registering the captain"})
    }

}

async function loginCaptain(req, res){
    // Validate the request body for email and password
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    
    try{const {email, password} = req.body
        // Find the captain by email and include the password field for comparison
        const isCaptain = await Captain.findOne({email}).select("+password")
        if(!isCaptain){
            return res.status(400).json({message: "Invalid email or password"})
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await isCaptain.comparePassword(password)
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"})
        }

        // Generate an authentication token for the captain and set it as a cookie
        const token = await isCaptain.generateAuthToken()
        res.cookie("token", token, {httpOnly:true, secure:process.env.NODE_ENV === "production", sameSite:"strict", maxAge:3600000})
        return res.status(200).json({message: "Captain logged in successfully", token})
    }catch (error) {
        console.error("Error logging in captain:", error)
        return res.status(500).json({message: "An error occurred while logging in the captain"})
    }
}

async function logoutCaptain(req, res){
    try{
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            return res.status(400).json({message: "No token provided"})
        }

        await blacklistTokenModel.create({token})
        res.clearCookie("token", {httpOnly:true, secure:process.env.NODE_ENV === "production", sameSite:"strict"})
        return res.status(200).json({message: "Captain logged out successfully"})

    }catch(err){
        console.log("Error logging out captain:", err)
        return res.status(400).json({message:"Internal Server Error"})
    }
}

module.exports = {
    registerCaptain,
    loginCaptain
}
