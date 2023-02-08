const express = require("express");
const router = express.Router();

const {
  authentication,
  logOut,
} = require("../controllers/AuthenticationController");

router.route("/authentication").post(authentication);
router.route("/logout").get(logOut);

module.exports = router;
