const express = require("express");
const router = express.Router();

const { addUser } = require("../controllers/User/UserController");

const { isLoggin, customRoles } = require("../middlewares/user");

router.route("/user").post(addUser);

module.exports = router;
