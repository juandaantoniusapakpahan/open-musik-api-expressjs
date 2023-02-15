const express = require("express");
const router = express.Router();

const {
  addUser,
  forgotPassword,
} = require("../controllers/User/UserController");

router.route("/user").post(addUser);
router.route("/password-forgot").post(forgotPassword);

module.exports = router;
