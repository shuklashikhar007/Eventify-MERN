const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/auth");

// GET  /event/
router.get("/", eventController.getEvents);

// POST /event/
router.post("/", authMiddleware.protect, eventController.createEvent);

// GET  /event/:event_id
router.get("/:event_id", eventController.getEventById);

// PUT  /event/:event_id
router.put("/:event_id", authMiddleware.protect, eventController.updateEvent);

// DELETE /event/:event_id
router.delete("/:event_id", authMiddleware.protect, eventController.deleteEvent);

module.exports = router;