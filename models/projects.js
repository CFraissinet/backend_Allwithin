const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  name: String,
  description: String,
  startDate: String,
  endDate: String,
  budget: Number,
  location: { type: mongoose.Schema.Types.ObjectId, ref: "locations" },
  crew: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const Project = mongoose.model("projects", projectSchema);

module.exports = Project;
