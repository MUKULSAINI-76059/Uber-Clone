const  express = require("express")
const router = express.Router()
const {body} = require("express-validator")
const {isLoggedIn} = require("../middlewares/user-middleware")
const {registerUser, loginUser, getUserProfile, logoutUser} = require("../controllers/user-controller")

router.post("/register", [body("fullName.firstName").isLength({min:3}).withMessage("First name must be at least 3 characters long"),
body("fullName.lastName").isLength({min:3}).withMessage("Last name must be at least 3 characters long"),
body("email").isEmail().withMessage("Please enter a valid email address"),
body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")], registerUser)

router.post("/login", [body("email").isEmail().withMessage("Please enter a valid email address"),
body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")], loginUser)

router.get("/profile", isLoggedIn, getUserProfile)

router.post("/logout", isLoggedIn, logoutUser)

module.exports = router
