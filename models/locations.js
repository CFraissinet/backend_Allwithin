const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  name: String,
  slug: String,
});

const Location = mongoose.model("locations", locationSchema);

module.exports = Location;
