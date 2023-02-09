const express = require("express");
const router = express.Router();

const {
  addPlaylist,
  getAllPlaylist,
  deletePlaylistById,
} = require("../controllers/Playlist/PlaylistController");

const { isLoggin, customRoles } = require("../middlewares/user");

router
  .route("/playlists")
  .post(isLoggin, customRoles("user", "admin"), addPlaylist)
  .get(isLoggin, getAllPlaylist);

router.route("/playlists/:playlistId").delete(isLoggin, deletePlaylistById);

module.exports = router;
