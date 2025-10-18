const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEventsByProfile,
  updateEvent,
  getEventLogs,
} = require("../controllers/eventController");

router.post("/", createEvent);
router.get("/:profileId", getEventsByProfile);
router.put("/:id", updateEvent);
router.get("/:id/logs", getEventLogs);

module.exports = router;