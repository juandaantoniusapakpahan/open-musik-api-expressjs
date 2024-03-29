const { nanoid } = require("nanoid");
const BigPromise = require("../../middlewares/bigPromise");
const UserValidator = require("../../domain/user/UserValidator");
const { Pool } = require("pg");
const InvariantError = require("../../exception/InvariantError");
const bcrypt = require("bcrypt");
const NotFoundError = require("../../exception/NotFoundError");
const NodeMailer = require("../../utils/sendEmail");
const jwtTokenMeneger = require("../../middlewares/jwtTokenManager");
const crypto = require("crypto");

// Object
const _pool = new Pool();

exports.addUser = BigPromise(async (req, res, next) => {
  try {
    UserValidator._varifyPayload(req.body);
    const { name, email, password } = req.body;
    const queryEmail = {
      text: "SELECT email FROM users WHERE email = $1",
      values: [email],
    };
    const resutlEmail = await _pool.query(queryEmail);
    if (resutlEmail.rows.length >= 1) {
      throw new InvariantError("Email have registered");
    }

    const id = `user-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const hashPassword = await bcrypt.hash(password, 10);
    const role = "user";
    const queryInsert = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, created_at",
      values: [id, name, email, hashPassword, role, createdAt],
    };
    const resultUser = await _pool.query(queryInsert);
    const user = resultUser.rows[0];
    res.status(201).json({
      status: "success",
      message: "Account was created",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  try {
    const email = req.body.email;

    const queryEmail = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };
    const resultEmail = await _pool.query(queryEmail);

    if (resultEmail.rows.length < 1) {
      throw new NotFoundError("Unregistered e-mail");
    }

    const forgotToken = await jwtTokenMeneger.generateForgotToken(
      resultEmail.rows[0].id
    );

    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${forgotToken}`;
    const message = `Klik this link to password reset: ${url}`;

    await NodeMailer({
      email: email,
      subject: "JAP || Password Reset",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Successful send email",
      data: {
        url,
      },
    });
  } catch (error) {
    next(error);
  }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
  const forgotToken = req.params.forgotToken;
  const { password, passwordConfirm } = req.body;
  const dateNow = Date.now();

  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  const tokenQuery = {
    text: "SELECT * FROM users WHERE forgotpasswordtoken = $1 AND CAST(forgotpasswordexpiry as BIGINT) > CAST($2 as BIGINT)",
    values: [forgotPasswordToken, dateNow],
  };

  try {
    const resultTokenQuery = await _pool.query(tokenQuery);

    if (resultTokenQuery.rows.length < 1) {
      throw new InvariantError("Token is invalid or expired!");
    }
    if (password !== passwordConfirm) {
      throw new InvariantError("Password and confirm password do not match");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const queryUpdatePassword = {
      text: "UPDATE users set password = $1, forgotpasswordtoken = null, forgotpasswordexpiry = null WHERE id = $2 RETURNING id",
      values: [passwordHash, resultTokenQuery.rows[0].id],
    };

    await _pool.query(queryUpdatePassword);

    res.status(200).json({
      status: "success",
      message: "Password was updated",
    });
  } catch (error) {
    next(error);
  }
});
