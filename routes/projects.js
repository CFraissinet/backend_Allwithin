const express = require("express");
const router = express.Router();

require("../models/connection");
const Project = require("../models/projects");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

router.post("/addProject", (req, res) => {
  // ADDED: Checking for the presence of the 'token' field in the request body
  // if (!checkBody(req.body, ["name", "description", "end_date"])) {
  //   res.json({ result: false, error: "Missing or empty fields" });
  //   return;
  // }
  console.log(req.body);

  // MODIFIED: Finding the user by their token instead of their username
  User.findOne({ token: req.body.token }).then((data) => {
    const newProject = new Project({
      user: data._id,
      name: req.body.name,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      location: req.body.location,
      crew: null,
      budget: null,
    });
    newProject.save().then((data) => {
      // ADDED: Returning the user's token in the response
      res.json({ result: true, id: data._id });
    });
  });
});

router.get("/token/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((dataUser) => {
    Project.find({ user: dataUser._id }).then((data) => {
      res.json({ result: true, projects: data });
    });
  });
});

router.get("/showProjects", (req, res) => {
  Project.find({}).then((data) => {
    res.json({ result: true, data: data });
  });
});

module.exports = router;
