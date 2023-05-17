const mongoose = require("mongoose");

const offerSchema = mongoose.Schema({
  name: String,
  country: String,
  rate: Number,
  description: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
});

const Offer = mongoose.model("offers", offerSchema);

module.exports = Offer;
