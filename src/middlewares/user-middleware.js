const userModel = require("../models/user-model")
const jwt = require("jsonwebtoken")

//Middleware to check if user is logged in
async function isLoggedIn(req,res, next){
    try{
        //Check for token in cookies
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({message: "Access denied. No token provided."})
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