const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {type: String , required : true, trim:true},
    email: {type: String, required: true, unique: true},
    university: {type: String, required: true,},
    password: {type: String, required: true}
})

const User = mongoose.model('User', userSchema)

module.exports = User;