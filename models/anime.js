const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const { DateTime } = require("luxon");

const AnimeSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100  },
  summary: { type: String, required: true },
});

AnimeSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/anime/${this._id}`;
});

// Export model
module.exports = mongoose.model("Anime", AnimeSchema);