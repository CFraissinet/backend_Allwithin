const express = require("express");
const router = express.Router();

require("../models/connection");
const Diploma = require("../models/diplomas");
const { checkBody } = require("../modules/checkBody");

module.exports = router;
