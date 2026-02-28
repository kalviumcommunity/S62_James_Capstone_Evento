const mongoose = require('mongoose');

// ── Contact sub-schema ──────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
}, { _id: false });

// ── Speaker / Guest sub-schema ──────────────────────────────────────────────
const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String },
  organisation: { type: String },
}, { _id: false });

// ── Main Event Schema ───────────────────────────────────────────────────────
const eventSchema = new mongoose.Schema({

  // Identity
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true },
  description: { type: String, required: true },
  eventType: {
    type: String,
    required: true,
    enum: ['Cultural', 'Technical', 'Hackathon', 'Talk / Seminar',
      'Workshop', 'Film / Media', 'Music', 'Drama', 'Sports', 'Other'],
  },
  level: {
    type: String,
    enum: ['College', 'Inter-College', 'State', 'National', 'International'],
  },
  tags: { type: [String], default: [] },
  themes: { type: [String], default: [] },

  // Schedule
  startDate: { type: Date, required: true },      // replaces `date`
  endDate: { type: Date },
  startTime: { type: String, required: true },       // replaces `time`
  endTime: { type: String },
  duration: { type: String },                       // e.g. "24 Hours"
  deadline: { type: Date },                         // registration cutoff

  // Location
  venue: { type: String, required: true },
  campus: { type: String },
  city: { type: String },
  streamLink: { type: String },

  // Organiser
  organizer: { type: String, required: true },
  department: { type: String },
  institution: { type: String },

  // People
  contacts: { type: [contactSchema], default: [] },
  speakers: { type: [speakerSchema], default: [] },

  // Notes
  importantNotes: { type: [String], default: [] },

  // Prizes
  hasPrizes: { type: Boolean, default: false },
  prizePool: { type: Number },
  prizes: { type: [String], default: [] },

  // Registration
  registrationLink: { type: String },
  eventWebsite: { type: String },
  isFree: { type: Boolean, default: true },
  entryFee: { type: Number, default: 0 },

  // Media
  image: { type: String },
  posterPublicId: { type: String },

  // Status
  status: {
    type: String,
    enum: ['Draft', 'Upcoming', 'Live', 'Completed', 'Cancelled'],
    default: 'Upcoming',
  },

  // Meta
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false },

}, { timestamps: true });

// Indexes for common query patterns
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ themes: 1 });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
