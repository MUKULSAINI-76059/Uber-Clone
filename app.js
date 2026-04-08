const express = require("express")
const cors = require("cors")
const app = express()
const userRoute = require("./src/routes/user-route")
require("dotenv").config()


app.use(cors())
app.use(express.json())
app.use("/api/user", userRoute)

module.exports = app;

