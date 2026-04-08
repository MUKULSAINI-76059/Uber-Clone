const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


//User Schema
const userSchema = new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true,
            minlength:[3, "First name must be at least 3 characters long"]
        },
        lastName:{
            type:String,
            required:true,
            minlength:[3, "Last name must be at least 3 characters long"],
            default:""
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
    }
    }
)

//Generate JWT token
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id}, process.env.SECRET_KEY, {expiresIn:"1h"})
    return token
}

//Compare password
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

//Hash password before saving
userSchema.methods.hashPassword = async function(password){
    return await bcrypt.hash(password, 10)
}

module.exports = mongoose.model("user", userSchema)