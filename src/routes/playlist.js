const express = require("express");
const router = express.Router();

const {
  addPlaylist,
  getAllPlaylist,
} = require("../controllers/Playlist/PlaylistController");

const { isLoggin, customRoles } = require("../middlewares/user");

router
  .route("/playlists")
  .post(isLoggin, customRoles("user", "admin"), addPlaylist)
  .get(isLoggin, getAllPlaylist);

module.exports = router;
