const express = require("express");
const router = express.Router();

const {
  addPlaylistSong,
  getPlaylistSong,
  deletePlaylistSong,
} = require("../controllers/PlaylistSongs/PlaylistSongsController");
const { isLoggin, customRoles } = require("../middlewares/user");

router
  .route("/playlists/:playlistId/songs")
  .post(isLoggin, customRoles("user", "admin"), addPlaylistSong)
  .get(isLoggin, customRoles("user", "admin"), getPlaylistSong)
  .delete(isLoggin, customRoles("user", "admin"), deletePlaylistSong);

module.exports = router;
