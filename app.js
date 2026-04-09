const express = require("express")
const cors = require("cors")
const app = express()
const cookieParser = require("cookie-parser")
const userRoute = require("./src/routes/user-route")
const captainRoute = require("./src/routes/captain-route")
require("dotenv").config()


app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use("/api/user", userRoute)
app.use("/api/captain", captainRoute)

module.exports = app;

