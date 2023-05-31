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
      res.json({ projectData: projectData });
    });
});

router.get("/:offerId", (req, res) => {
  Offer.find({ _id : req.params.offerId })
    // .populate("project")
    .populate("users")
    .then((projectData) => {
      console.log(projectData);
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
