const BigPromise = require("../../middlewares/bigPromise");
const NotFoundError = require("../../exception/NotFoundError");
const AuthenticationError = require("../../exception/AuthenticationError");
const { Pool } = require("pg");
const logginSchema = require("../../domain/user/UserLogin");
const bcrypt = require("bcrypt");
const cookieToken = require("../../utils/cookieToken");

const _pool = new Pool();

exports.authentication = BigPromise(async (req, res, next) => {
  try {
    logginSchema._varifyPayload(req.body);
    const { email, password } = req.body;

    const queryEmail = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    const resultEmail = await _pool.query(queryEmail);

    if (resultEmail.rows.length < 1) {
      throw new NotFoundError("Email not registered");
    }

    const passwordCompare = await bcrypt.compare(
      password,
      resultEmail.rows[0].password
    );
    const user = resultEmail.rows[0];

    if (!passwordCompare) {
      throw new AuthenticationError("Email or password doesn't match");
    }

    cookieToken(user, res);
  } catch (error) {
    next(error);
  }
});

exports.logOut = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Succes LoggOut",
  });
});
