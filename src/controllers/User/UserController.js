const { nanoid } = require("nanoid");
const BigPromise = require("../../middlewares/bigPromise");
const UserValidator = require("../../domain/user/UserValidator");
const { Pool } = require("pg");
const InvariantError = require("../../exception/InvariantError");
const bcrypt = require("bcrypt");
const NotFoundError = require("../../exception/NotFoundError");

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
