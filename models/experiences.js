const mongoose = require("mongoose");

const experienceSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  job_title: String,
  start_date: Date,
  end_date: Date,
  project_description: String,
});

const Experience = mongoose.model("experiences", experienceSchema);

module.exports = Experience;
