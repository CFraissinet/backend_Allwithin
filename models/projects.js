const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  name: String,
  description: String,
  startDate: String,
  endDate: String,
  budget: Number,
  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "offers" }],
  location: { type: mongoose.Schema.Types.ObjectId, ref: "locations" },
});

const Project = mongoose.model("projects", projectSchema);

module.exports = Project;
