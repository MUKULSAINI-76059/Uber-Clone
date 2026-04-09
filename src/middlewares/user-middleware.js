const userModel = require("../models/user-model")
const jwt = require("jsonwebtoken")
const blacklistModel = require("../models/blacklistToken-model")

//Middleware to check if user is logged in
async function isLoggedIn(req,res, next){
    try{
        //Check for token in cookies
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            return res.status(401).json({message: "Access denied. No token provided."})
        }

        //Check if token is blacklisted
        const blacklistedToken = await blacklistModel.findOne({token})
        if(blacklistedToken){
            return res.status(401).json({message: "Invalid token. Please log in again."})
        }

        //Verify token and attach user to request object
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await userModel.findById(decoded._id)
        if(!user){
            return res.status(401).json({message: "Unauthorized"})
        }
        req.user = user
        next()
    } catch (error) {
        console.error("Error in isLoggedIn middleware:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

module.exports = {isLoggedIn}