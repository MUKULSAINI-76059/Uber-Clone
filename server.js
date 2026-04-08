const http = require("http")
const app = require("./app")
const connectDB = require("./src/db/db")
const server = http.createServer(app)
const dns = require("dns")
dns.setServers(['8.8.8.8'],['8.8.4.4'])

connectDB()

const port = process.env.PORT 
server.listen(port,() =>{
    console.log(`http://localhost:${port}`)
})
