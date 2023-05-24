const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  name: String,
  password: String,
  token: String,
  birthdate: Date,
  email: String,
  location: { type: mongoose.Schema.Types.ObjectId, ref: "locations" },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "roles" },
  // contact: { type: mongoose.Schema.Types.ObjectId, ref: "contacts" },
  phone_number: String,
  links: { linkedin: String, github: String },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "jobs" },
  experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: "experiences" }],
  diploma: [{ type: mongoose.Schema.Types.ObjectId, ref: "contact" }],
  photo: String,
  cv: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
