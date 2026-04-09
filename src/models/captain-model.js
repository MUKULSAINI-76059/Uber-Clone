const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const captainSchema = new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required: true,
            minlength:[3, "First name must be at least 3 characters long"]
        },
        lastName:{
            type:String,
            minlength:[3, "Last name must be at least 3 characters long"],
            default: undefined
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
    },
    password:{
        type:String,
        required:true,
        minlength:[6, "Password must be at least 6 characters long"],
        select:false
    },
    sockedId:{
        type:String,
        default:""
    },
    status:{
        type:String,
        enum:["unavailable", "available"],
        default:"unavailable"
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minlength:[3, "Vehicle color must be at least 3 characters long"]
        },
        plateNumber:{
            type:String,
            required:true,
            minlength:[3, "Vehicle plate number must be at least 3 characters long"]
        },
        capacity:{
            type:String,
            required:true,
            minlength:[1, "Vehicle capacity must be at least 1 character long"]
        },
        vehicleType:{
            type:String,
            required:true,
           enum:["car", "motorcycle", "auto"],
        },
        location:{
            lat:{
                type:Number
            },
            lng:{
                type:Number
            }   
        }
    }
}) 

captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id}, process.env.SECRET_KEY, {expiresIn:"24h"})
    return token
}

captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

captainSchema.methods.hashPassword = async function(password){
    return await bcrypt.hash(password, 10)
}

module.exports = mongoose.model("captain", captainSchema)