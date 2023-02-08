const express = require("express");
const router = express.Router();

const { addPlaylist } = require("../controllers/Playlist/PlaylistController");

const { isLoggin, customRoles } = require("../middlewares/user");

router
  .route("/playlist")
  .post(isLoggin, customRoles("user", "admin"), addPlaylist);

module.exports = router;
