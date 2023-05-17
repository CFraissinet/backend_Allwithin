const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  description: String,
  start_date: Date,
  end_date: Date,
  crew: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  budget: Number,
});

const Project = mongoose.model("projects", projectSchema);

module.exports = Project;
