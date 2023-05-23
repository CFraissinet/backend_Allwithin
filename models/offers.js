const mongoose = require("mongoose");

const offerSchema = mongoose.Schema({
  name: String,
  country: String,
  rate: Number,
  description: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  user_Id: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const Offer = mongoose.model("offers", offerSchema);

module.exports = Offer;
