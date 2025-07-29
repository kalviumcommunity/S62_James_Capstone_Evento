const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  organizer:  { type: String, required: true },
  contact: { type: String, required: true },
  eventType:  { type: String, required: true },
  tags: { type: String, required: true }, // could be comma-separated
  registrationLink: { type: String, /*required: true*/ },
  image: { type: String, /*required: true*/ }, // Cloudinary image URL
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
