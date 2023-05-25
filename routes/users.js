const express = require("express");
const router = express.Router();
require("../models/connection");
const User = require("../models/users");
const Job = require("../models/jobs");
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

// SIGN IN ROUTE --------------------------
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

// SIGNUP IN ROUTE --------------------------
router.post("/signup", (req, res) => {
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
        email: req.body.email,
        password: hash,
        job: req.body.job,
        experiences: req.body.experiences,
        token: uid2(32),
        birthdate: req.body.birthdate,
        location: null,
        phone_number: req.body.phone_number,
        linkedin: req.body.linkedin,
        github: req.body.github,
        diploma: null,
        photo: null,
        cv: null,
      });

      newUser.save().then((data) => {
        res.json({ result: true, user: data });
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

// UPDATECV ROUTE --------------------------
const cpUploadCV = upload.fields([{ name: "cv", maxCount: 1 }]);
router.post(
  "/updateCV",
  // send to "uploads" folder
  cpUploadCV,
  (req, res) => {
    if (req.fileValidationError) {
      res.json({ error: req.fileValidationError });
      return;
    }

    let cvURL;
    let cvPath =
      "./" + req.files["cv"][0].destination + req.files["cv"][0].filename;

    cloudinary.uploader
      .upload(cvPath)
      .then((data) => {
        fs.unlinkSync(cvPath);
        cvURL = data.secure_url;
        res.json({ cv: cvURL });
      })
      .then(() => {
        req.body = JSON.parse(req.body.data);
      })
      .then(() => {
        console.log(req.body);

        User.updateOne({ email: req.body.email }, { cv: cvURL }).then(
          (data) => {
            console.log(data);
          }
        );
      });
  }
);

// UPDATEAVATAR ROUTE --------------------------
const cpUploadAvatar = upload.fields([{ name: "avatar", maxCount: 1 }]);
router.post(
  "/updateAvatar",
  // send to "uploads" folder
  cpUploadAvatar,
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

    cloudinary.uploader
      .upload(avatarPath)
      .then((data) => {
        fs.unlinkSync(avatarPath);
        avatarURL = data.secure_url;
        res.json({ avatar: avatarURL });
      })
      .then(() => {
        req.body = JSON.parse(req.body.data);
      })
      .then(() => {
        console.log(req.body);

        User.updateOne({ email: req.body.email }, { photo: avatarURL }).then(
          (data) => {
            console.log(data);
          }
        );
      });
  }
);

module.exports = router;

// GET ROUTE FOR ALL JOBS IN DB --------------------------

router.get("/jobs", (req, res) => {
  // Check if the user has not already been registered
  Job.find({}).then((data) => {
    res.json({ result: true, jobs: data });
  });
});

// router for add user to one job
router.post("/jobs", (req, res) => {
  Job.updateOne(
    { _id: req.body.jobId },
    { $push: { users: req.body.userId } }
  ).then((data) => {
    res.json({ result: true, data: data });
  });
});

// GET SPECIFIC USER'S FULL DATA USING TOKEN

router.get("/userData/:token", (req, res) => {
  // Check if the user has not already been registered
  User.find({ token: req.params.token })
    .populate("job")
    .then((data) => {
      res.json({ result: true, userData: data });
    });
});

// router.put("/updateModale", (req, res) => {
//   User.updateOne(
//     { token: req.body.token },
//     {
//       email: req.body.email,
//       location: req.body.location,
//       phone_number: req.body.phoneNumber,
//       job: req.body.job,
//       links: { linkedin: req.body.linkedin, github: req.body.github },
//     }
//   ).then((data) => {
//     res.json({ result: true, user: data });
//     console.log(data);
//   });
// });
