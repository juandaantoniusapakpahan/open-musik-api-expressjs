const express = require("express");
const router = express.Router();

const { testRoute, addUser } = require("../controllers/User/UserController");

const { isLoggin, customRoles } = require("../middlewares/user");

router.route("/user").post(addUser);
router.route("/user").get(isLoggin, customRoles("user"), testRoute);

module.exports = router;
