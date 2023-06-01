const express = require("express");
const router = express.Router();

require("../models/connection");
const Offer = require("../models/offers");
const Project = require("../models/projects");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

router.get("/project/:projectId", (req, res) => {
  Offer.find({ project: req.params.projectId })
    // .populate("project")
    .populate("users")
    .then((projectData) => {
      console.log(projectData);
      res.json({ projectData: projectData });
    });
});

router.put("/confirm", (req, res) => {
  Offer.findById(req.body.id).then((data) => {
    const newIds = data.users.filter(
      (users) => users.toString() !== req.body.users);
      console.log(newIds)
    Offer.updateOne({ users: data.users }, { users: newIds }).then(
      (data) => {
        if (data.modifiedCount > 0) {
          Offer.findById(req.body.id)
          .populate("users")
          .then((data) => 
          res.json({ result : true, users: data.users }))
        } else {
          res.json ({ result : false, message: "Nothing was edit"})
        }
      }
    );
  });
});

// router.put("/accept", (req, res) => {
//   removeId = req.body.users;
//   console.log(removeId);
//   Offer.findById(req.body.id).then((data) => {
//     const newIds = data.users.filter(
//       (users) => users.toString() !== removeId
//     );
//     console.log(newIds);
//     Offer.updateOne({ users: data.users }, { users: newIds }).then(
//       (data) => {
//         if (data.modifiedCount > 0) {
//           Offer.findById(req.body.id)
//           .populate("users")
//           .then((data) => 
//           res.json({ result : true, users: data.users }))
//         } else {
//           res.json ({ result : false, message: "Nothing was edit"}));
//   });
  
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
  console.log(req.body);
  const newOffer = new Offer({
    offers: req.body.offers,
    project: req.body.project,
  });

  newOffer.save().then((data) => {
    res.json({ result: true, offer: data });
  });
});

// GET ALL OFFERS
router.get("/allOffers", (req, res) => {
  Offer.find()
    .populate("project")
    .populate({ path: "project", populate: { path: "location" } })

    .then((data) => {
      res.json({ result: true, allOffers: data });
    });
});

router.post("/addUserIdOnOffer", (req, res) => {
  User.findOne({ token: req.body.token }).then((userData) => {
    Offer.findOne({ "offers.job.value": req.body.offerId }).then((data) => {
      console.log("offer id : ");
      if (data.users.some((e) => e.toString() == userData._id)) {
        res.json({
          result: false,
          msg: "You have already applied to this offer",
        });
      } else {
        Offer.updateOne(
          { "offers.job.value": req.body.offerId },
          { $push: { users: userData._id } }
        ).then(() => {
          res.json({
            result: true,
            msg: "You have applied to this offer",
          });
        });
      }
    });
  });
});

module.exports = router;
