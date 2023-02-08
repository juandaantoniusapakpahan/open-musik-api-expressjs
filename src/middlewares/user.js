const AuthorizationError = require("../exception/AuthenticationError");
const AuthenticationError = require("../exception/AuthenticationError");
const BigPromise = require("../middlewares/bigPromise");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

exports.isLoggin = BigPromise(async (req, res, next) => {
  const _pool = new Pool();
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new AuthenticationError("Login first to access this page!");
  }

  const decode = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

  const id = decode.id;
  const query = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  };
  const resultQuery = await _pool.query(query);
  const user = resultQuery.rows[0];

  user.password = undefined;
  req.user = user;
  next();
});

exports.customRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      new AuthorizationError("You are not allowed for this resource!");
    }
    next();
  };
};
