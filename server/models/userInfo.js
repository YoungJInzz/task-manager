let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: String,
  password: String,
  email:String,
  user_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", userSchema);
