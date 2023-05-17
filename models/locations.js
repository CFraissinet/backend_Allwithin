const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  city: String,
  country: String,
  time_zone: String,
});

const Location = mongoose.model("locations", locationSchema);

module.exports = Location;
