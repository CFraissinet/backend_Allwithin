const express = require("express");
const router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const multer = require("multer");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// allows to add extension to files received
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

// sends all files recieved in "uploads" folder
const upload = multer({ storage: storage });

// route to get all infos from front-end for signup
router.post(
  "/signup",

  // send to "uploads" folder
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  (req, res) => {
    if (!req.body.data) {
      console.log(req.body);
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        name: req.body.name,
        password: hash,
        token: uid2(32),
        birthdate: req.body.birthdate,
        email: req.body.email,
        location: null,
        role: null,
        contact: null,
        job: null,
        experiences: null,
        diploma: null,
      });

      newUser.save().then(() => {
        res.json({ result: true });
      });

      return;
    }

    // After, files has been retreived, reputs req.body.data in Json form so we can collect data
    req.body = JSON.parse(req.body.data);

    // Checks if one of the fields is empty
    if (!checkBody(req.body, ["firstname", "name", "email", "password"])) {
      res.json({ result: false, error: "Missing or empty fields" });
      return;
    }

    // Check if the user has not already been registered
    User.findOne({ email: req.body.email }).then((data) => {
      if (data === null) {
        // Authentication with token and hash mechanics
        const hash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
          firstname: req.body.firstname,
          name: req.body.name,
          password: hash,
          token: uid2(32),
          birthdate: req.body.birthdate,
          email: req.body.email,
          location: null,
          role: null,
          contact: null,
          job: null,
          experiences: null,
          diploma: null,
          cv: null,
          avatar: null,
        });

        newUser.save().then(() => {
          res.json({ result: true });
        });
      } else {
        // User already exists in database
        res.json({ result: false, error: "User already exists" });
      }
    });
  }
);

router.post("/signin", (req, res) => {
  // Checks if one of the fields is empty
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    // Authentication with token and hash mechanics
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

module.exports = router;
