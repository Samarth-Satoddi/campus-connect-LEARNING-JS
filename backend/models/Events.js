const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  time: String,
  date: String,
  location: String,
  category: String,
  description: String,
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;