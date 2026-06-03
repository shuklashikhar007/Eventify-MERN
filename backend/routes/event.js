const express = require("express");
const router = express.Router();
const { getEvents, createEvent, getEventById, updateEvent, deleteEvent } = require("../controllers/eventController");
const { protect } = require("../middleware/auth");
// GET  /event/         — public, paginated
router.get("/", getEvents);
// POST /event/         — protected
router.post("/", protect, createEvent);
// GET  /event/:event_id — public
router.get("/:event_id", getEventById);
// PUT  /event/:event_id — protected
router.put("/:event_id", protect, updateEvent);
// DELETE /event/:event_id — protected
router.delete("/:event_id", protect, deleteEvent);
module.exports = router;
