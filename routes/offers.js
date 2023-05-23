const express = require("express");
const router = express.Router();

require("../models/connection");
const Offer = require("../models/offers");
const { checkBody } = require("../modules/checkBody");

router.get("/:projectId", (req, res) => {
  Offer.findById({ projectId: req.params.projectiD })
    // .populate("project")
    // .populate("user_Id")
    .then((projectData) => {
      res.json({ projectData: projectData });
    });
});

module.exports = router;
