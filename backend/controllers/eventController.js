const { Event, formatEvent } = require("../models/Event");
const mongoose = require("mongoose");

const PAGE_SIZE = 10;

// ── Populate helper ─────────────────────────────────────────────────────────
// Populates created_by and each updater's updated_by in one query
const populateEvent = (query) =>
  query
    .populate("created_by_id", "name email image_url")
    .populate("event_updaters.updated_by_id", "name email image_url");

// Renames populated fields so formatEvent can find them
const hydrateEvent = (doc) => {
  // Mongoose populate puts the result on the ref field name.
  // We alias them to what formatEvent expects.
  doc.created_by = doc.created_by_id;
  doc.event_updaters = (doc.event_updaters || []).map((u) => {
    u.updated_by = u.updated_by_id;
    return u;
  });
  return doc;
};

// ── GET /event/?page=N ───────────────────────────────────────────────────────
const getEvents = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const skip = (page - 1) * PAGE_SIZE;

    const docs = await populateEvent(
      Event.find().sort({ createdAt: -1 }).skip(skip).limit(PAGE_SIZE)
    );

    const events = docs.map((d) => formatEvent(hydrateEvent(d)));
    return res.status(200).json({ events });
  } catch (err) {
    console.error("getEvents error:", err);
    return res.status(500).json({ message: "Failed to fetch events." });
  }
};

// ── POST /event/ ─────────────────────────────────────────────────────────────
const createEvent = async (req, res) => {
  try {
    const { title, description, location, event_start_time, event_end_time, is_canceled, is_rescheduled } = req.body;

    const doc = await Event.create({
      title,
      description,
      location,
      event_start_time,
      event_end_time,
      is_canceled: is_canceled ?? false,
      is_rescheduled: is_rescheduled ?? false,
      created_by_id: req.user._id,
      event_updaters: [],
    });

    const populated = await populateEvent(Event.findById(doc._id));
    const event = formatEvent(hydrateEvent(populated));

    return res.status(201).json({ event });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("createEvent error:", err);
    return res.status(500).json({ message: "Failed to create event." });
  }
};

// ── GET /event/:event_id ──────────────────────────────────────────────────────
const getEventById = async (req, res) => {
  try {
    const { event_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(event_id)) {
      return res.status(404).json({ message: "Event not found." });
    }

    const doc = await populateEvent(Event.findById(event_id));
    if (!doc) return res.status(404).json({ message: "Event not found." });

    return res.status(200).json({ event: formatEvent(hydrateEvent(doc)) });
  } catch (err) {
    console.error("getEventById error:", err);
    return res.status(500).json({ message: "Failed to fetch event." });
  }
};

// ── PUT /event/:event_id ──────────────────────────────────────────────────────
const updateEvent = async (req, res) => {
  try {
    const { event_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(event_id)) {
      return res.status(404).json({ message: "Event not found." });
    }

    const doc = await Event.findById(event_id);
    if (!doc) return res.status(404).json({ message: "Event not found." });

    // Apply allowed fields
    const allowed = ["title", "description", "location", "event_start_time", "event_end_time", "is_canceled", "is_rescheduled"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) doc[field] = req.body[field];
    });

    // Record who updated
    doc.event_updaters.push({
      ref_event_id: doc._id,
      updated_by_id: req.user._id,
    });

    await doc.save();

    const populated = await populateEvent(Event.findById(doc._id));
    const event = formatEvent(hydrateEvent(populated));

    return res.status(200).json({ event });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("updateEvent error:", err);
    return res.status(500).json({ message: "Failed to update event." });
  }
};

// ── DELETE /event/:event_id ───────────────────────────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const { event_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(event_id)) {
      return res.status(404).json({ message: "Event not found." });
    }

    const doc = await Event.findByIdAndDelete(event_id);
    if (!doc) return res.status(404).json({ message: "Event not found." });

    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (err) {
    console.error("deleteEvent error:", err);
    return res.status(500).json({ message: "Failed to delete event." });
  }
};

module.exports = { getEvents, createEvent, getEventById, updateEvent, deleteEvent };
