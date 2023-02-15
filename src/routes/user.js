const express = require("express");
const router = express.Router();

const {
  addUser,
  forgotPassword,
  passwordReset,
} = require("../controllers/User/UserController");

router.route("/user").post(addUser);
router.route("/password-forgot").post(forgotPassword);
router.route("/password/reset/:forgotToken").post(passwordReset);

module.exports = router;
