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

// router.put("/refuse", (req, res) => {
//   Offer.findOne({ project: req.body.project }).then((data) => {
//     const newIds = data.user_Id.filter(
//       (user_Id) => user_Id.toString() !== req.body.user_Id
//     );
//     console.log(newIds);
//     Offer.updateOne({ _id: data._id }, { user_Id: newIds });
//     console.log(data.user_Id);
//   });
// });

router.put("/refuse", (req, res) => {
  Offer.findById(req.body._id).then((data) => {
    const newIds = data.user_Id.filter(
      (user_Id) => user_Id.toString() !== req.body.user_Id
    );
    console.log(data.user_Id);
    Offer.updateOne({ _id: data._id }, { user_Id: newIds }).then((data) => {
      res.json({ result: data.user_id });
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
