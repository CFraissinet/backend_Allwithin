const express = require("express");
const router = express.Router();
require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const multer = require("multer");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// allows to add extension to files received
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // adds uploads file to store files recieved from front
    var destinationPath = "uploads/";
    if (file.fieldname === "avatar") {
      // adds specific file field "avatar" in avatar file
      destinationPath += "avatar/";
    } else if (file.fieldname === "cv") {
      // adds specific file field "cv" in avatar file
      destinationPath += "cv/";
    }
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (file.fieldname === "avatar") {
      if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
        req.fileValidationError = "Only png, jpg and jpeg files are allowed";
        return callback(null, false, req.fileValidationError);
      }
      if (file.size > 1024 * 1024 * 2) {
        req.fileValidationError = "File size exceeds 2 MB";
        return callback(null, false, req.fileValidationError);
      }
    }
    if (file.fieldname === "cv") {
      if (!["application/pdf"].includes(file.mimetype)) {
        req.fileValidationError = "Only pdf files are allowed";
        return callback(null, false, req.fileValidationError);
      }
      if (file.size > 1024 * 1024 * 15) {
        req.fileValidationError = "File size exceeds 15 MB";
        return callback(null, false, req.fileValidationError);
      }
    }
    callback(null, true);
  },
});

const cpUpload = upload.fields([
  { name: "cv", maxCount: 1 },
  { name: "avatar", maxCount: 1 },
]);
// route to get all infos from front-end for signup
router.post(
  "/signup",
  // send to "uploads" folder
  cpUpload,
  (req, res) => {
    if (req.fileValidationError) {
      res.json({ error: req.fileValidationError });
      return;
    }

    let avatarURL;
    let avatarPath =
      "./" +
      req.files["avatar"][0].destination +
      req.files["avatar"][0].filename;

    let cvURL;
    let cvPath =
      "./" + req.files["cv"][0].destination + req.files["cv"][0].filename;

    cloudinary.uploader
      .upload(avatarPath)
      .then((data) => {
        fs.unlinkSync(avatarPath);
        avatarURL = data.secure_url;
      })
      .then(() => {
        cloudinary.uploader
          .upload(cvPath)
          .then((data) => {
            fs.unlinkSync(cvPath);
            cvURL = data.secure_url;
            console.log(cvURL);
          })

          .then(() => {
            // After, files has been retreived, reputs req.body.data in Json form so we can collect data
            req.body = JSON.parse(req.body.data);
          })
          .then(() => {
            // Checks if one of the fields is empty
            if (
              !checkBody(req.body, ["firstname", "name", "email", "password"])
            ) {
              res.json({ result: false, error: "Missing or empty fields" });
              return;
            }
            // console.log(avatarURL);
            // Check if the user has not already been registered
            User.findOne({ email: req.body.email }).then((data) => {
              if (data === null) {
                // Authentication with token and hash mechanics
                const hash = bcrypt.hashSync(req.body.password, 10);

                const newUser = new User({
                  firstname: req.body.firstname,
                  name: req.body.name,
                  email: req.body.email,
                  password: hash,
                  job: req.body.job,
                  experiences: req.body.experiences,
                  token: uid2(32),
                  birthdate: null,
                  location: null,
                  role: null,
                  contact: null,
                  diploma: null,
                  photo: avatarURL,
                  cv: cvURL,
                });

                newUser.save().then(() => {
                  res.json({ result: true, avatar: avatarURL, cv: cvURL });
                });
              } else {
                // User already exists in database
                res.json({
                  result: false,
                  error: "User already exists",
                });
              }
            });
          });
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
