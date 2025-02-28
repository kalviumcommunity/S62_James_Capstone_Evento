const express = require("express");
const app = express();
const mongoose = require("mongoose")
require("dotenv").config()

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("This is the backend")
})

app.listen(3000,()=>{
    console.log("The server is running on http://localhost:3000")
})
