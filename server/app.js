const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const router = require("./router/index.js");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const db = mongoose.connection;

db.on("error", console.error);
db.once("open", function() {
  console.log("Connected to mongo server");
});
require("dotenv").config();
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/mongodb_tutorial");

app.use(cors({ credentials: true, origin: "*" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/", router);
app.set("jwt-secret", process.env.jwtSecret);
app.set("port", port);
app.listen(port);
console.log("Listening on", port);

module.exports.app = app;
