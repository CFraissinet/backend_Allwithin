const express = require("express");
const router = express.Router();

require("../models/connection");
const Contact = require("../models/contacts");
const { checkBody } = require("../modules/checkBody");

module.exports = router;
