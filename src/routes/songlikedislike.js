const express = require("express");
const router = express.Router();
const { isLoggin, customRoles } = require("../middlewares/user");
const {
  likeSong,
  dislikeSong,
} = require("../controllers/SongLike/SongLikeController");

router.route("/song/:songId/like").post(isLoggin, likeSong);
router.route("/song/:songId/dislike").post(isLoggin, dislikeSong);

module.exports = router;
