const express = require("express")
const router = express.Router()
const {registerCaptain, loginCaptain, logoutCaptain} = require("../controllers/captain-controller")
const {body} = require("express-validator")
const {isCaptainLoggedIn} = require("../middlewares/captain-middleware")

router.post("/register", [
    body("fullName.firstName").isString().isLength({min:3}).withMessage("First name must be at least 3 characters long"),
    body("fullName.lastName").optional({checkFalsy:true}).isString().isLength({min:3}).withMessage("Last name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Please enter a valid email address"),  
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body("vehicle.color").isString().isLength({min:3}).withMessage("Vehicle color must be at least 3 characters long"),
    body("vehicle.plateNumber").isString().isLength({min:3}).withMessage("Vehicle plate number must be at least 3 characters long"),
    body("vehicle.capacity").isString().isLength({min:1}).withMessage("Vehicle capacity must be at least 1 character long"),
    body("vehicle.vehicleType").isIn(["car", "motorcycle", "auto"]).withMessage("Vehicle type must be either car, motorcycle, or auto")
],registerCaptain)

router.post("/login", [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
], loginCaptain)

router.get("/logout", isCaptainLoggedIn, logoutCaptain);

module.exports = router;