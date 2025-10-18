// models/Event.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    profiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: [true, "At least one profile must be selected"],
        index: true,
      },
    ],

    eventTimezone: {
      type: String,
      required: [true, "Event timezone is required"],
    },

    startTime: {
      type: Date,
      required: [true, "Start date and time are required"],
    },
    endTime: {
      type: Date,
      required: [true, "End date and time are required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.pre("save", function (next) {
  if (this.endTime < this.startTime) {
    next(new Error("End date/time cannot be before the start date/time."));
  } else {
    next();
  }
});

module.exports = mongoose.model("Event", EventSchema);
