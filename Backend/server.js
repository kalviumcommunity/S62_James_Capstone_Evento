// ⚠️ DEV ONLY — bypass SSL cert errors when calling Cloudinary from localhost
// This MUST come before any require() that uses TLS (i.e. before cloudinary).
// On Render/production this is fine to leave as-is (NODE_ENV=production skips it).
if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

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

app.use('/api/events', eventRoutes)
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
})
