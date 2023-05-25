const mongoose = require("mongoose");

const offerSchema = mongoose.Schema({
  offers: [],
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
});

const Offer = mongoose.model("offers", offerSchema);

module.exports = Offer;
