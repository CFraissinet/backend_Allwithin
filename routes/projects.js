const express = require("express");
const router = express.Router();

require("../models/connection");
const Project = require("../models/projects");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

router.post("/addProject", (req, res) => {
  if (!checkBody(req.body, ["name", "description", "end_date"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ user: req.body.token }).then((data) => {
    const newProject = new Project({
      user: data._id,
      name: req.body.name,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      crew: null,
      budget: req.body.budget,
    });
    newProject.save().then(() => {
      res.json({ result: true });
    });
  });
});

router.get("/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((dataUser) => {
    Project.find({ user: dataUser._id }).then((data) => {
      res.json({ result: true, projects: data });
    });
  });
});

module.exports = router;
