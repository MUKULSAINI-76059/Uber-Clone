const blacklist = require('../models/blacklistToken-model');
const captainModel = require('../models/captain-model');
const jwt = require('jsonwebtoken');

async function isCaptainLoggedIn(req, res, next) {
    try{
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            return res.status(401).json({message: "Access denied. No token provided."})
        }   
        const blacklistedToken = await blacklist.findOne({token})
        if(blacklistedToken){
            return res.status(401).json({message: "Invalid token. Please log in again."})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const captain = await captainModel.findById(decoded.id)
        if(!captain){
            return res.status(401).json({message: "Captain not found. Please log in again."})
        }
        req.captain = captain
        next()
    } catch (error) {
        return res.status(401).json({message: "Invalid token. Please log in again."})

    }
}


module.exports = {isCaptainLoggedIn}