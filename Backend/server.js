const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config()

const connect = require('./src/config/db')
const eventRoutes = require('./src/routes/event.route')

connect();

app.use(cors())
app.use(express.json())

// app.get("/",(req,res)=>{
//     res.send("This is the backend")
// })

app.use('/api/events',eventRoutes)
const PORT = process.env.PORT || 3000;



app.listen(PORT,()=>{
    console.log("The server is running on http://localhost:3000")
})
