const crypto = require("crypto");

function sha256Hex(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function randomToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("base64url");
}

module.exports = { randomToken, sha256Hex };

