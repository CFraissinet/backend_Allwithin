const express = require("express");
const router = express.Router();

require("../models/connection");
const Location = require("../models/locations");
const { checkBody } = require("../modules/checkBody");

router.get("/allLocation", (req, res) => {
  Location.find({}).then((data) => {
    res.json({ result: true, Locations: data });
  });
});

module.exports = router;
