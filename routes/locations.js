const express = require("express");
const router = express.Router();

require("../models/connection");
const Location = require("../models/locations");
const { checkBody } = require("../modules/checkBody");

module.exports = router;
