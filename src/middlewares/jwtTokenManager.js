const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Pool } = require("pg");

const _pool = new Pool();

const jwtTokenMeneger = {
  generateAccessToken: (_id) => {
    const token = jwt.sign({ id: _id }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
  },

  generateForgotToken: async (userid) => {
    // generate a long and random string
    const forgotToken = crypto.randomBytes(20).toString("hex");

    // getting a hash - make sure to get a hash on backend
    const forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");

    const forgotTokenExpiry = Date.now() + 20 * 60 * 1000;

    const query = {
      text: "UPDATE users set forgotpasswordtoken = $1, forgotpasswordexpiry = $2 WHERE id = $3",
      values: [forgotPasswordToken, forgotTokenExpiry, userid],
    };

    await _pool.query(query);

    return forgotToken;
  },
};

module.exports = jwtTokenMeneger;
