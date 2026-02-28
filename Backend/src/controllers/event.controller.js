const Event = require('../models/event.model');
const { cloudinary } = require('../utils/cloudinary');

// ── Helpers ─────────────────────────────────────────────────────────────────
const splitChip = v => (v || '').split(',').map(t => t.trim()).filter(Boolean);

const safeParseJSON = (str, fallback = []) => {
  try { return JSON.parse(str || JSON.stringify(fallback)); }
  catch { return fallback; }
};

// Builds the update/create payload from req.body + optional file
const buildPayload = (body, file, existingPublicId) => {
  const payload = {
    title: body.title,
    subtitle: body.subtitle,
    description: body.description,
    eventType: body.eventType,
    level: body.level || undefined,
    tags: splitChip(body.tags),
    themes: splitChip(body.themes),
    importantNotes: splitChip(body.importantNotes),

    // Schedule — legacy fallback: old fields date/time map to startDate/startTime
    startDate: body.startDate || body.date,
    endDate: body.endDate || undefined,
    startTime: body.startTime || body.time,
    endTime: body.endTime || undefined,
    duration: body.duration || undefined,
    deadline: body.deadline || undefined,

    // Location
    venue: body.venue,
    campus: body.campus || undefined,
    city: body.city || undefined,
    streamLink: body.streamLink || undefined,

    // Organiser
    organizer: body.organizer,
    department: body.department || undefined,
    institution: body.institution || undefined,

    // People (safe parse — bad JSON silently defaults to [])
    contacts: safeParseJSON(body.contacts, []),
    speakers: safeParseJSON(body.speakers, []),

    // Booleans
    // undefined !== 'false' → true — correct default for isFree when field is absent
    isFree: body.isFree !== 'false',
    hasPrizes: body.hasPrizes === 'true',

    // Numbers
    entryFee: Number(body.entryFee || 0),
    prizePool: body.prizePool ? Number(body.prizePool) : undefined,
    prizes: splitChip(body.prizes),

    // Registration
    registrationLink: body.registrationLink || undefined,
    eventWebsite: body.eventWebsite || undefined,

    // Status
    status: body.status || 'Upcoming',
  };

  return payload;
};

// ── GET all events ───────────────────────────────────────────────────────────
// Default: only Upcoming + Live (excludes Drafts / Cancelled)
// ?mine=true + auth: all statuses for createdBy = req.user._id (My Events)
const getAllEvents = async (req, res) => {
  try {
    const query = {};

    if (req.query.mine === 'true' && req.user?._id) {
      query.createdBy = req.user._id;   // all statuses for owner
    } else {
      query.status = { $in: ['Upcoming', 'Live'] };
    }

    const events = await Event.find(query).sort({ startDate: 1, createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
};

// ── GET single event by ID ───────────────────────────────────────────────────
// Normalizes missing arrays for old documents
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json({
      ...event.toObject(),
      contacts: event.contacts || [],
      speakers: event.speakers || [],
      tags: event.tags || [],
      themes: event.themes || [],
      importantNotes: event.importantNotes || [],
      prizes: event.prizes || [],
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event', error: err.message });
  }
};

// ── CREATE event ─────────────────────────────────────────────────────────────
const createEvent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Poster image is required' });
    }

    // Upload poster to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'evento-posters',
    });

    const payload = buildPayload(req.body);
    payload.image = result.secure_url;
    payload.posterPublicId = result.public_id;
    payload.createdBy = req.user?._id || null;

    const newEvent = new Event(payload);
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });

  } catch (err) {
    const errDetail = err?.message
      || err?.error?.message
      || JSON.stringify(err)
      || 'Unknown error';
    console.error('Error creating event:', errDetail);
    res.status(500).json({ message: 'Error creating event', error: errDetail });
  }
};

// ── UPDATE event ─────────────────────────────────────────────────────────────
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const updateData = buildPayload(req.body);

    // If a new poster was uploaded, replace old Cloudinary image
    if (req.file) {
      if (event.posterPublicId) {
        await cloudinary.uploader.destroy(event.posterPublicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'evento-posters',
      });
      updateData.image = result.secure_url;
      updateData.posterPublicId = result.public_id;
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    const errDetail = err?.message || err?.error?.message || JSON.stringify(err);
    console.error('Error updating event:', errDetail);
    res.status(500).json({ message: 'Failed to update event', error: errDetail });
  }
};

// ── DELETE event ─────────────────────────────────────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.posterPublicId) {
      await cloudinary.uploader.destroy(event.posterPublicId);
    }

    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };
