const express = require("express");
const router = express.Router();

require("../models/connection");
const Job = require("../models/jobs");
const { checkBody } = require("../modules/checkBody");

module.exports = router;
