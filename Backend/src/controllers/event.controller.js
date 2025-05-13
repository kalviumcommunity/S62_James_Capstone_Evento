const Event = require('../models/event.model');

const getAllEvents = async (req,res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    }catch(error) {
        res.status(500).json({message: 'Server Error',error});
    }
}

module.exports = {
    getAllEvents,
};