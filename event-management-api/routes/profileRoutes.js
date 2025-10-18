const express = require("express");
const router = express.Router();
const {
  createProfile,
  getProfiles,
} = require("../controllers/profileController");

router.route("/").post(createProfile).get(getProfiles);

module.exports = router;
