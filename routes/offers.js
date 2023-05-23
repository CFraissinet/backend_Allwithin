const express = require("express");
const router = express.Router();

require("../models/connection");
const Offer = require("../models/offers");
const { checkBody } = require("../modules/checkBody");

router.get("/:projectId", (req, res) => {
  Offer.find({ project: req.params.projectId })
    .populate("project")
    .populate("user_Id")
    .then((projectData) => {
      res.json({ projectData: projectData });
    });
});

module.exports = router;
