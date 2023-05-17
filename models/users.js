const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  name: String,
  email: String,
  password: String,
  job: String,
  token: String,
  experiences: String,
  photo: String,
  cv: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
