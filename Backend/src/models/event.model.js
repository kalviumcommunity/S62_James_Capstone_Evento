const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    description: String,
    date : Date,
    location : String,
    category: String,
    image: String,
    createdBy: {
       type:  mongoose.Schema.Types.ObjectId,
       ref:'User',
    },
})

const Event = mongoose.model('Event',eventSchema);

module.exports = Event;
