const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  name: String,
  password: String,
  token: String,
  birthdate: String,
  email: String,
  location: { type: mongoose.Schema.Types.ObjectId, ref: "locations" },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "roles" },
  phone_number: String,
  linkedin: String,
  github: String,
  job: { type: mongoose.Schema.Types.ObjectId, ref: "jobs" },
  experiences: String,
  diploma: [{ type: mongoose.Schema.Types.ObjectId, ref: "contact" }],
  photo: String,
  cv: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
