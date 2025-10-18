const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Profile name is required"],
    unique: true,
    trim: true,
  },
  defaultTimezone: {
    type: String,
    required: true,
    default: "UTC",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Profile", ProfileSchema);
