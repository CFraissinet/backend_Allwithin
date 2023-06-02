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

  // MODIFIED: Finding the user by their token instead of their username
  User.findOne({ token: req.body.token }).then((data) => {
    const newProject = new Project({
      user: data._id,
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      location: req.body.location,
      budget: null,
    });
    newProject.save().then((data) => {
      // ADDED: Returning the user's token in the response
      console.log(data);
      res.json({ result: true, data });
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

router.put("/addCrew", (req, res) => {
  removeId = req.body.users
Project.findById(req.body.projectId).then((project) => {
  console.log(project);

  if (!project.crew) {
    project.crew = [removeId];
    res.json ({ result: true, message: "people add to project"})
  } else if (project.crew.includes(removeId)) {
    res.json({ result: false, error: "User already in the project" });
  } else {
    project.crew = [...project.crew, removeId];
  }
  project.save().then(() => {
    res.json({ result: true, project: project });
  });
});
});

router.get("/crewProject/:projectId", (req, res) => {
  Project.findOne({ projectId : req.params.id })
  .populate('crew')
  .populate({ path: "crew", populate: { path: "job" } })
  .populate('user')
  .then((data) => {
    res.json({ result: true, crew: data.crew, user: data.user, job: data.job});
    });
  });

module.exports = router;
