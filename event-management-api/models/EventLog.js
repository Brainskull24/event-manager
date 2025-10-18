const mongoose = require("mongoose");

const EventLogSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
    index: true,
  },
  updaterProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  changes: [
    {
      message: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("EventLog", EventLogSchema);
