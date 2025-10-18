const Profile = require("../models/Profile");

exports.createProfile = async (req, res) => {
  const { name, defaultTimezone } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Profile name is required." });
  }

  try {
    const profileExists = await Profile.findOne({ name });
    if (profileExists) {
      return res.status(400).json({ message: "Profile name already exists." });
    }

    const profile = await Profile.create({
      name,
      defaultTimezone,
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
};

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({});
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
