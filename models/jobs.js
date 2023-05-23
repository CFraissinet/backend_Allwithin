const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  title: String,
});

const Job = mongoose.model("jobs", jobSchema);

module.exports = Job;
