const crypto = require("crypto");

const encryption = function(password) {
  let cryptoPassword = crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
    return cryptoPassword
};

module.exports = encryption;
