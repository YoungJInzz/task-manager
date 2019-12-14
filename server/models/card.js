const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let cardSchema = new Schema({
  content: String,
  card_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('card',cardSchema)