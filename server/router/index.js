var csrf = require("csurf");
var bodyParser = require("body-parser");
const express = require("express");
var session = require("express-session");
const router = express.Router();
const jwt = require("jsonwebtoken");
const encryption = require("../middleware/crypto");
const decodeJWT = require("../middleware/decodeJWT");
const board = require("../models/board");
const card = require("../models/card");
const list = require("../models/list");
const trello = require("../models/trello");
const userInfo = require("../models/userInfo");

// var parseJson = bodyParser.json();
// var parseUrlencoded = bodyParser.urlencoded();
// var parseBody = [parseJson, parseUrlencoded]
// var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

var csrfProtection = csrf()
require("dotenv").config();

// test api
router.get("/deleteAllUserInfo", function(req, res) {
  userInfo.remove({}).then(() => res.send("deleteSuccess"));
});

router.get("/deleteAllTrello", function(req, res) {
  trello.remove({}).then(() => res.send("deleteSuccess"));
});

router.get("/getUserInfo", function(req, res) {
  userInfo.find({}).then(data => res.send(data));
});

router.get("/getAlltrello", function(req, res) {
  trello.find({}).then(data => res.send(data));
});
router.get("/board", function(req, res) {
  console.log(req.query.color);
});

router.post("/process", parseForm, csrfProtection, function(req, res) {
  res.send("data is being processed");
});

// test api
router.get("/getCSRF", csrfProtection, function(req, res) {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  res.json({ "XSRF-TOKEN": req.csrfToken() });
});

router.post("/signUp", function(req, res) {
  console.log(req.body);
  userInfo
    .findOne({ userName: req.body.userName })
    .then(async function(userData) {
      if (userData) {
        res.send({ isUser: true });
      } else {
        let user = new userInfo();
        let usertrello = new trello();
        user.userName = req.body.userName;
        user.password = encryption(req.body.password);
        user.email = req.body.email;
        usertrello.userName = req.body.userName;
        await usertrello.save();
        await user.save().then(() => res.send({ signdUp: "success" }));
      }
    });
});

router.post("/checkId", function(req, res) {
  console.log(req.body);
  userInfo.findOne({ userName: req.body.userName }).then(function(userData) {
    if (userData) {
      res.json({ isUser: true });
    } else {
      res.json({ isUser: false });
    }
  });
});

router.post("/signIn", function(req, res) {
  let password = encryption(req.body.password);
  userInfo.findOne({ userName: req.body.userName }).then(function(data) {
    if (!data) {
      res.send({ isId: "falseId" });
    } else {
      userInfo
        .findOne({ userName: req.body.userName, password: password })
        .then(function(data) {
          if (!data) {
            res.send({ isId: "falsePassword" });
          } else {
            let token = jwt.sign(
              {
                id: req.body.userName
              },
              process.env.jwtSecret
            );
            res.send({ isId: "true", token: token }); //res.cookie만했을시 응답이없다. body를 붙여줘야되는듯하다
          }
        });
    }
  });
});

router.get("/getuser", async function(req, res) {
  let id = decodeJWT(req.headers["x-access-token"]).id;
  let user = await userInfo.findOne({ userName: id });
  res.send(user);
});

router.post("/updatePassword", async function(req, res) {
  let id = decodeJWT(req.headers["x-access-token"]).id;
  await userInfo.findOneAndUpdate(
    { userName: id },
    { $set: { password: encryption(req.body.password) } }
  );
  res.send({ isPasswordChange: "success" });
});

router.get("/boards", async function(req, res) {
  let id = decodeJWT(req.headers["x-access-token"]).id;
  let boardData = await trello.findOne({ userName: id }).then(data =>
    data.board.map(board => {
      let obj = {};
      obj["title"] = board.title;
      obj["id"] = board.id;
      return obj;
    })
  );
  res.send(boardData);
});

router.post("/getboard", parseForm, async function(req, res) {
  let id = decodeJWT(req.headers["x-access-token"]).id;
  let boardData = await trello.findOne(
    { userName: id, "board._id": req.body.boardId },
    { "board.$": req.body.boardId }
  );
  res.send(boardData.board);
});

router.post("/addBoard",parseForm, function(req, res) {
  console.log(req.headers)
  let id = decodeJWT(req.headers["x-access-token"]).id;
  let newBoard = new board();
  newBoard.title = req.body.title;
  trello
    .findOneAndUpdate({ userName: id }, { $push: { board: newBoard } })
    .then(() => res.send("addSuccess"));
});

router.post("/updateBoard", function(req, res) {
  let id = decodeJWT(req.headers["x-access-token"]).id;
  trello
    .findOneAndUpdate(
      { userName: id, "board._id": req.body.boardId },
      { $set: { "board.$.title": req.body.title } }
    )
    .then(() => res.send("updateSuccess"));
});

router.post("/deleteBoard", function(req, res) {
  let id = decodeJWT(req.headers["x-access-token"]).id;
  console.log(req.body);
  trello
    .findOneAndUpdate(
      { userName: id },
      { $pull: { board: { _id: req.body.boardId } } }
    )
    .then(() => res.send("updateSuccess"));
});

router.post("/addList", function(req, res) {
  let id = decodeJWT(req.headers["x-access-token"]).id;
  let newList = new list();
  newList.title = req.body.title;
  trello
    .findOneAndUpdate(
      { userName: id, "board._id": req.body.boardId },
      { $push: { "board.$.list": newList } }
    )
    .then(() => res.send("addList"));
});

router.post("/updateList", function(req, res) {
  console.log(req.body.title);
  let id = decodeJWT(req.headers["x-access-token"]).id;
  trello
    .findOneAndUpdate(
      { userName: id },
      { $set: { "board.$[board].list.$[list].title": req.body.title } },
      {
        arrayFilters: [
          { "board._id": req.body.boardId },
          { "list._id": req.body.listId }
        ]
      }
    )
    .then(() => res.send("addCardSuccess"));
});

router.post("/deleteList", function(req, res) {
  let id = decodeJWT(req.headers["x-access-token"]).id;
  trello
    .findOneAndUpdate(
      { userName: id },
      { $pull: { "board.$[board].list": { _id: req.body.listId } } },
      {
        arrayFilters: [{ "board._id": req.body.boardId }]
      }
    )
    .then(() => res.send("delete"));
});

router.post("/addCard", function(req, res) {
  let id = decodeJWT(req.headers["x-access-token"]).id;
  let newCard = new card();
  newCard.content = req.body.content;
  trello
    .findOneAndUpdate(
      { userName: id },
      { $push: { "board.$[board].list.$[list].card": newCard } },
      {
        arrayFilters: [
          { "board._id": req.body.boardId },
          { "list._id": req.body.listId }
        ]
      }
    )
    .then(() => res.send("addCardSuccess"));
});

router.post("/updateCard", function(req, res) {
  let id = decodeJWT(req.headers["x-access-token"]).id;
  trello
    .findOneAndUpdate(
      { userName: id },
      {
        $set: {
          "board.$[board].list.$[list].card.$[card].content": req.body.content
        }
      },
      {
        arrayFilters: [
          { "board._id": req.body.boardId },
          { "list._id": req.body.listId },
          { "card._id": req.body.cardId }
        ]
      }
    )
    .then(() => res.send("cardUpdate"));
});

router.post("/deleteCard", function(req, res) {
  let id = decodeJWT(req.headers["x-access-token"]).id;
  trello
    .findOneAndUpdate(
      { userName: id },
      {
        $pull: {
          "board.$[board].list.$[list].card": { _id: req.body.cardId }
        }
      },
      {
        arrayFilters: [
          { "board._id": req.body.boardId },
          { "list._id": req.body.listId }
        ]
      }
    )
    .then(() => res.send("deleteCard"));
});
module.exports = router;
