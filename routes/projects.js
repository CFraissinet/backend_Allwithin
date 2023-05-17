const express = require("express");
const router = express.Router();

require("../models/connection");
const Project = require("../models/projects");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

router.post("/", (req, res) => {
  if (!checkBody(req.body, ["name", "description", "end_date"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.body.token }).then((data) => {
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

module.exports = router;
