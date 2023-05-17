const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  name: String,
});

const Role = mongoose.model("roles", roleSchema);

module.exports = Role;
