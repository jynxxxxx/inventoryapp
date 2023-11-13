const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: {type: Number, required: true},
  inventory: {type: Number, required: true},
  anime: { type: Schema.Types.ObjectId, ref: "Anime", required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
});

ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/item/${this._id}`;
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);
