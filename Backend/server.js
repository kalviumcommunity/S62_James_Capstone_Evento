const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config()

const connect = require('./src/config/db')
const eventRoutes = require('./src/routes/event.route')
const authRoutes = require('./src/routes/auth.route')
connect();

app.use(cors())
app.use(express.json())

// app.get("/",(req,res)=>{
//     res.send("This is the backend")
// })

app.use('/api/events',eventRoutes)
app.use('/api/auth',authRoutes);

const PORT = process.env.PORT || 3000;



app.listen(PORT,()=>{
    console.log("The server is running on http://localhost:3000")
})
