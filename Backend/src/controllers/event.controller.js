const Event = require('../models/event.model');

const getAllEvents = async (req,res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    }catch(error) {
        res.status(500).json({message: 'Server Error',error});
    }
}

const createEvent = async (req,res) =>{
    const {
        title,
        description,
        date,
        Location,
        Category,
        image,
        CreatedBy,
    } = req.body

if(!title || !date){
    return res.status(400).json({error:'Title and Date are required'})
}

try {
    const newEvent = new Event({
        title,
        description,
        date,
        Location,
        Category,
        image,
        CreatedBy,
    })

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);

}catch(error){
    res.status(500).json({error:'Failed to create an event'})
}

}

module.exports = {
    getAllEvents,
    createEvent,
};