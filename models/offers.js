const mongoose = require("mongoose");

const offerSchema = mongoose.Schema({
  offers: {},
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const Offer = mongoose.model("offers", offerSchema);

module.exports = Offer;
