const mongoose = require("mongoose");
const EventModel = require("../models/Event");

const Event = EventModel.Event;
const formatEvent = EventModel.formatEvent;

const PAGE_SIZE = 10;

function populateEvent(query) {
  return query
    .populate("created_by_id", "name email image_url")
    .populate("event_updaters.updated_by_id", "name email image_url");
}

function hydrateEvent(doc) {
  doc.created_by = doc.created_by_id;
  var updaters = doc.event_updaters || [];
  for (var i = 0; i < updaters.length; i++) {
    updaters[i].updated_by = updaters[i].updated_by_id;
  }
  return doc;
}

async function getEvents(req, res) {
  try {
    var page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;
    var skip = (page - 1) * PAGE_SIZE;

    var docs = await populateEvent(
      Event.find().sort({ createdAt: -1 }).skip(skip).limit(PAGE_SIZE)
    );

    var events = docs.map(function (d) {
      return formatEvent(hydrateEvent(d));
    });

    return res.status(200).json({ events: events });
  } catch (err) {
    console.error("getEvents error:", err);
    return res.status(500).json({ message: "Failed to fetch events." });
  }
}

async function createEvent(req, res) {
  try {
    var body = req.body;

    var doc = await Event.create({
      title: body.title,
      description: body.description,
      location: body.location,
      event_start_time: body.event_start_time,
      event_end_time: body.event_end_time,
      is_canceled: body.is_canceled || false,
      is_rescheduled: body.is_rescheduled || false,
      created_by_id: req.user._id,
      event_updaters: [],
    });

    var populated = await populateEvent(Event.findById(doc._id));
    var event = formatEvent(hydrateEvent(populated));

    return res.status(201).json({ event: event });
  } catch (err) {
    if (err.name === "ValidationError") {
      var messages = Object.values(err.errors).map(function (e) {
        return e.message;
      });
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("createEvent error:", err);
    return res.status(500).json({ message: "Failed to create event." });
  }
}

async function getEventById(req, res) {
  try {
    var event_id = req.params.event_id;

    if (!mongoose.Types.ObjectId.isValid(event_id)) {
      return res.status(404).json({ message: "Event not found." });
    }

    var doc = await populateEvent(Event.findById(event_id));
    if (!doc) {
      return res.status(404).json({ message: "Event not found." });
    }

    return res.status(200).json({ event: formatEvent(hydrateEvent(doc)) });
  } catch (err) {
    console.error("getEventById error:", err);
    return res.status(500).json({ message: "Failed to fetch event." });
  }
}

async function updateEvent(req, res) {
  try {
    var event_id = req.params.event_id;

    if (!mongoose.Types.ObjectId.isValid(event_id)) {
      return res.status(404).json({ message: "Event not found." });
    }

    var doc = await Event.findById(event_id);
    if (!doc) {
      return res.status(404).json({ message: "Event not found." });
    }

    var allowed = ["title", "description", "location", "event_start_time", "event_end_time", "is_canceled", "is_rescheduled"];
    for (var i = 0; i < allowed.length; i++) {
      var field = allowed[i];
      if (req.body[field] !== undefined) {
        doc[field] = req.body[field];
      }
    }

    doc.event_updaters.push({
      ref_event_id: doc._id,
      updated_by_id: req.user._id,
    });

    await doc.save();

    var populated = await populateEvent(Event.findById(doc._id));
    var event = formatEvent(hydrateEvent(populated));

    return res.status(200).json({ event: event });
  } catch (err) {
    if (err.name === "ValidationError") {
      var messages = Object.values(err.errors).map(function (e) {
        return e.message;
      });
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("updateEvent error:", err);
    return res.status(500).json({ message: "Failed to update event." });
  }
}

async function deleteEvent(req, res) {
  try {
    var event_id = req.params.event_id;

    if (!mongoose.Types.ObjectId.isValid(event_id)) {
      return res.status(404).json({ message: "Event not found." });
    }

    var doc = await Event.findByIdAndDelete(event_id);
    if (!doc) {
      return res.status(404).json({ message: "Event not found." });
    }

    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (err) {
    console.error("deleteEvent error:", err);
    return res.status(500).json({ message: "Failed to delete event." });
  }
}

module.exports = {
  getEvents: getEvents,
  createEvent: createEvent,
  getEventById: getEventById,
  updateEvent: updateEvent,
  deleteEvent: deleteEvent,
};