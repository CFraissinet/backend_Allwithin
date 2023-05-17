const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  name: String,
});

const Skill = mongoose.model("skills", skillSchema);

module.exports = Skill;
