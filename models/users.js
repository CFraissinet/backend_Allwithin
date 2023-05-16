const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  name: String,
  email: String,
  password: String,
  confirmPassword: String,
  confirmationToken: String,
  job: String,
  experiences: [String],
  photo: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
