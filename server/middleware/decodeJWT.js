const jwt = require("jsonwebtoken");
require("dotenv").config();

const decodeJWT = function(token){
  let decoded= jwt.verify(
       token,
        process.env.jwtSecret,
      );
    return decoded
}

module.exports = decodeJWT;
