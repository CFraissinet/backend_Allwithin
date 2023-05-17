const mongoose = require("mongoose");

const diplomaSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  name: String,
  date_obtained: Date,
  establishement: String,
});

const Diploma = mongoose.model("diplomas", diplomaSchema);

module.exports = Diploma;
