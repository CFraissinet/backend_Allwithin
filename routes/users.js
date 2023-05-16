const express = require("express");
const router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/signup",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log(req.body.firstname);
    if (
      !checkBody(req.body, [
        "firstname",
        "name",
        "email",
        "password",
        "confirmPassword",
      ])
    ) {
      res.json({ result: false, error: "Missing or empty fields" });
      return;
    }

    // Check if the user has not already been registered
    User.findOne({ email: req.body.email }).then((data) => {
      if (data === null) {
        // Authentication with token and hash mechanics
        const hash = bcrypt.hashSync(req.body.password, 10);
        const confirmHash = bcrypt.hashSync(req.body.confirmPassword, 10);

        const newUser = new User({
          firstname: req.body.firstname,
          name: req.body.name,
          email: req.body.email,
          password: hash,
          confirmPassword: confirmHash,
          token: uid2(32),
          confirmationToken: uid2(32),
          job: req.body.job,
          experiences: req.body.experiences,
          photo: req.body.photo,
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
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    console.log(data);
    // Authentication with token and hash mechanics
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

module.exports = router;
