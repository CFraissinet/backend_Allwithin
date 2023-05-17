const express = require("express");
const router = express.Router();

require("../models/connection");
const Offer = require("../models/offers");
const { checkBody } = require("../modules/checkBody");

module.exports = router;
