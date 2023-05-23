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

//router for add profession in BDD
router.post("/addJob", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    const newJob = new Job({
      user: data._id,
      title: req.body.title,
    });
    newJob.save().then(() => {
      res.json({ result: true });
    });
    console.log(req.body);
  });
});

module.exports = router;
