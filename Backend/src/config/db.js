const mongoose = require('mongoose');

const connect = async ()=> {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB Connection Successful');
    }catch(error) {
        console.error('MongoDB connection failed');
        
    }
}

module.exports = connect;