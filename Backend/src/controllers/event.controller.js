const Event = require('../models/event.model');
const { cloudinary } = require('../utils/cloudinary');



// @desc    Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// @desc    Create a new event
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      venue,
      organizer,
      contact,
      registrationLink,
      eventType,      // ✅ added this
      tags,           // ✅ added this
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Poster image is required' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'evento-posters',
    });

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      venue,
      organizer,
      contact,
      registrationLink,
      eventType,               // ✅ include it in the event object
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),  // ✅ ensure it's an array
      image: result.secure_url,
      createdBy: req.user?._id || null,  // if using auth middleware
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};


// @desc    Update an event (optional)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

// @desc    Delete an event (optional)
// const deleteEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const event = await Event.findById(id);

//     if (!event) return res.status(404).json({ message: 'Event not found' });

//     // Delete poster from Cloudinary
//     if (event.posterPublicId) {
//       await cloudinary.uploader.destroy(event.posterPublicId);
//     }

//     await event.deleteOne();
//     res.status(200).json({ message: 'Event deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete event', error: error.message });
//   }
// };

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
};
