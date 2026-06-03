const mongoose = require("mongoose");

var eventUpdaterSchema = new mongoose.Schema(
  {
    ref_event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    updated_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, _id: true }
);

var eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      minlength: 2,
      maxlength: 255,
    },
    event_start_time: {
      type: Date,
      required: [true, "Start time is required"],
    },
    event_end_time: {
      type: Date,
      required: [true, "End time is required"],
    },
    is_canceled: {
      type: Boolean,
      default: false,
    },
    is_rescheduled: {
      type: Boolean,
      default: false,
    },
    created_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event_updaters: [eventUpdaterSchema],
  },
  { timestamps: true }
);

function formatUser(u) {
  return {
    ID: u._id.toString(),
    name: u.name,
    email: u.email,
    image_url: u.image_url || null,
  };
}

function formatEvent(doc) {
  var updaters = (doc.event_updaters || []).map(function (u) {
    return {
      event_updater_id: u._id.toString(),
      ref_event_id: u.ref_event_id.toString(),
      updated_by_id: u.updated_by_id.toString(),
      updated_by: u.updated_by ? formatUser(u.updated_by) : null,
      UpdatedAt: u.updatedAt,
    };
  });

  return {
    event_id: doc._id.toString(),
    CreatedAt: doc.createdAt,
    UpdatedAt: doc.updatedAt,
    title: doc.title,
    description: doc.description,
    location: doc.location,
    event_start_time: doc.event_start_time,
    event_end_time: doc.event_end_time,
    is_canceled: doc.is_canceled,
    is_rescheduled: doc.is_rescheduled,
    created_by_id: doc.created_by_id.toString(),
    created_by: doc.created_by ? formatUser(doc.created_by) : null,
    event_updaters: updaters,
  };
}

var EventModel = mongoose.model("Event", eventSchema);

module.exports = {
  Event: EventModel,
  formatEvent: formatEvent,
};