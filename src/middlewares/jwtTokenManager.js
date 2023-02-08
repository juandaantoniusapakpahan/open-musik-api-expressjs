const jwt = require("jsonwebtoken");

const jwtTokenMeneger = {
  generateAccessToken: (_id) => {
    const token = jwt.sign({ id: _id }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
  },
};

module.exports = jwtTokenMeneger;
