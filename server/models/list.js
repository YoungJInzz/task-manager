const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let cardSchema = new Schema({
  content: String,
  card_date: { type: Date, dafault: Date.now },
});

let listSchema = new Schema({
  title: String,
  card: [cardSchema],
  list_date: { type: Date, dafault: Date.now },
});

module.exports = mongoose.model("list", listSchema);
