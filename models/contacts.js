const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  phone_number: String,
  linkedin: String,
  github: String,
});

const Contact = mongoose.model("contacts", contactSchema);

module.exports = Contact;
