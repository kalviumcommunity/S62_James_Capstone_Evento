const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    description: String,
    date : Date,
    Location : String,
    Category: String,
    image: String,
    CreatedBy: {
       type:  mongoose.Schema.Types.ObjectId,
       ref:'User',
    },
})

const Event = mongoose.model('Event',eventSchema);

module.exports = Event;

