const express = require("express");
const router = express.Router();

require("../models/connection");
const Offer = require("../models/offers");
const Project = require("../models/projects");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

router.get("/:projectId", (req, res) => {
  Offer.find({ project: req.params.projectId })
    // .populate("project")
    .populate("user_Id")
    .then((projectData) => {
      res.json({ projectData: projectData });
    });
});

router.put("/refuse", (req, res) => {
  Offer.findById(req.body.id).then((data) => {
    const newIds = data.user_Id.filter(
      (user_Id) => user_Id.toString() !== req.body.user_Id
    );
    Offer.updateOne({ user_Id: data.user_Id }, { user_Id: newIds }).then(
      (data) => {
        res.json({ result: data.user_id });
      }
    );
  });
});

router.put("/accept", (req, res) => {
  removeId = req.body.user_Id;
  console.log(removeId);
  Offer.findById(req.body.id).then((data) => {
    const newIds = data.user_Id.filter(
      (user_Id) => user_Id.toString() !== removeId
    );
    console.log(newIds);
    Offer.updateOne({ user_Id: data.user_Id }, { user_Id: newIds }).then(() => {
      Project.findById(req.body.projectId).then((project) => {
        console.log(project);

        if (!project.crew) {
          project.crew = [removeId];
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
  });
});

// router.post("", (req, res) => {
//   Offer.find({ project: req.params.projectId })
//     // .populate("project")
//     .populate("user_Id")
//     .then((projectData) => {
//       res.json({ projectData: projectData });
//     });
// });

// ADD OFFERS FROM A CREATED PROJECT

router.post("/newOffer", (req, res) => {
  const newOffer = new Offer({
    offers: req.body.offers,
    name: req.body.project,
  });

  newOffer.save().then((data) => {
    res.json({ result: true, offer: data });
  });
});

module.exports = router;
