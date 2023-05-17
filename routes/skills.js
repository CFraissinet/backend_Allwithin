const express = require("express");
const router = express.Router();

require("../models/connection");
const Skill = require("../models/skills");
const { checkBody } = require("../modules/checkBody");

module.exports = router;
