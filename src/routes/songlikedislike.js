const express = require("express");
const router = express.Router();
const { isLoggin, customRoles } = require("../middlewares/user");
const { likeSong } = require("../controllers/SongLike/SongLikeController");

router.route("/song/:songId/like").post(isLoggin, likeSong);

module.exports = router;
