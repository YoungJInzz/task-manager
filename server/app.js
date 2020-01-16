var csrf = require('csurf')
const bodyParser = require("body-parser");
const express = require("express");
var cookieParser = require('cookie-parser')
var session = require('express-session')
const cors = require("cors");
const morgan = require("morgan");
const router = require("./router/index.js");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const db = mongoose.connection;
app.use(cookieParser())

app.use(session({
  secret: 'keyboard cat'   
 }))
// app.use(cookie('keyboard cat'));
// app.use(csrf());

db.on("error", console.error);
db.once("open", function() {
  console.log("Connected to mongo server");
});
require("dotenv").config();
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/mongodb_tutorial");

app.use(cors({ origin: "http://task-manager-ver1.1.s3-website.ap-northeast-2.amazonaw", credentials: true })); 
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/", router);
app.set("jwt-secret", process.env.jwtSecret);
app.set("port", port);
app.listen(port);
console.log("Listening on", port);

module.exports.app = app;