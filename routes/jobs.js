const express = require("express");
const router = express.Router();

require("../models/connection");
const Job = require("../models/jobs");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

module.exports = router;

//router for get one profession with paramater
router.get("/:title", (req, res) => {
  Job.findOne({ title: req.params.title }).then((data) => {
    res.json({ result: true, jobs: data });
  });
});

//router for get all professions
router.get("/", (req, res) => {
  Job.find().then((data) => {
    res.json({ result: true, jobs: data });
  });
});

router.get("/job/:id", (req, res) => {
  Job.findById(req.params.id).then((data) => {
    req.json({ result: true, job: data.name });
  });
});

module.exports = router;
//com
