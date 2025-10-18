const Event = require("../models/Event");
const EventLog = require("../models/EventLog");
const Profile = require("../models/Profile");

const validateDates = (startTime, endTime) => {
  return new Date(endTime) >= new Date(startTime);
};

exports.createEvent = async (req, res) => {
  const { profiles, eventTimezone, startTime, endTime, createdBy } = req.body;

  if (
    !profiles ||
    profiles.length === 0 ||
    !eventTimezone ||
    !startTime ||
    !endTime
  ) {
    return res.status(400).json({ message: "Missing required event fields." });
  }

  if (!validateDates(startTime, endTime)) {
    return res
      .status(400)
      .json({ message: "End date/time cannot be before the start date/time." });
  }

  try {
    const event = await Event.create({
      profiles,
      eventTimezone,
      startTime,
      endTime,
      createdBy,
    });

    res.status(201).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating event", details: error.message });
  }
};

exports.getEventsByProfile = async (req, res) => {
  try {
    const events = await Event.find({
      profiles: req.params.profileId,
    })
      .populate("profiles", "name")
      .sort({ startTime: 1 });

    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events", details: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  const { profiles, eventTimezone, startTime, endTime, createdBy } = req.body;
  const eventId = req.params.id;

  if (
    !profiles ||
    profiles.length === 0 ||
    !eventTimezone ||
    !startTime ||
    !endTime
  ) {
    return res.status(400).json({ message: "Missing required event fields." });
  }
  if (!validateDates(startTime, endTime)) {
    return res
      .status(400)
      .json({ message: "End date/time cannot be before the start date/time." });
  }

  try {
    const oldEvent = await Event.findById(eventId);
    if (!oldEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    const allProfiles = await Profile.find({}, "name");

    const changes = generateLogChanges(oldEvent, req.body, allProfiles);

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        profiles,
        eventTimezone,
        startTime,
        endTime,
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate("profiles", "name");

    if (changes.length > 0) {
      await EventLog.create({
        eventId: eventId,
        updaterProfileId: createdBy,
        changes: changes,
      });
    }

    res.json(updatedEvent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating event", details: error.message });
  }
};

exports.getEventLogs = async (req, res) => {
  try {
    const logs = await EventLog.find({ eventId: req.params.id })
      .populate("updaterProfileId", "name")
      .sort({ timestamp: -1 }); // Newest logs first

    res.json(logs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching logs", details: error.message });
  }
};

const generateLogChanges = (oldEvent, newPayload, allProfiles) => {
  // <--- ACCEPT ALL PROFILES
  const changes = [];
  const fieldsToTrack = ["profiles", "eventTimezone", "startTime", "endTime"];

  // Helper to resolve name from ID
  const resolveName = (profileId) => {
    const profile = allProfiles.find(
      (p) => p._id.toString() === profileId.toString()
    );
    console.log("Resolving profile ID:", profileId, "to name:", profile ? profile.name : "Unknown Profile");
    return profile ? profile.name : "Unknown Profile";
  };

  for (const field of fieldsToTrack) {
    const oldValue = oldEvent[field];
    const newValue = newPayload[field];

    if (field === "profiles") {
      const oldIds = oldValue.map((id) => id.toString()).sort();
      const newIds = newValue.map((id) => id.toString()).sort();

      if (JSON.stringify(oldIds) !== JSON.stringify(newIds)) {
        // Resolve names for the OLD set of IDs
        const oldNames = oldIds.map(resolveName).join(", ");
        // Resolve names for the NEW set of IDs
        const newNames = newIds.map(resolveName).join(", ");

        changes.push({
          message: `Assigned profiles changed from [${oldNames}] to [${newNames}]`, // <--- FIX MESSAGE
        });
      }
    } else if (field === "startTime" || field === "endTime") {
      const oldDate = oldValue.toISOString();
      const newDate = newValue;

      if (oldDate !== newDate) {
        const fieldName =
          field === "startTime" ? "Start Date/Time" : "End Date/Time";

        changes.push({
          message: `${fieldName} was updated.`,
        });
      }
    } else if (oldValue !== newValue) {
      changes.push({
        message: `Timezone changed from ${oldValue} to ${newValue}.`,
      });
    }
  }
  return changes;
};
