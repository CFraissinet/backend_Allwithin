const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  name: String,
  description: String,
  start_date: String,
  end_date: String,
  budget: Number,
  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "offers" }],
  location: String,
});

const Project = mongoose.model("projects", projectSchema);

module.exports = Project;
