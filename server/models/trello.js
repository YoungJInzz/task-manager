const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let cardSchema = new Schema({
  content: String,
  card_date: { type: Date, default: Date.now },
});

let listSchema = new Schema({
  title: String,
  card: [cardSchema],
  list_date: { type: Date, dafault: Date.now },
});

let boardSchema = new Schema({
  title: String,
  list: [listSchema],
  board_date: { type: Date, deafult: Date.now },
});

let trelloSchema = new Schema({
  userName: String,
  board: [boardSchema],
  trello_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("trello", trelloSchema);
