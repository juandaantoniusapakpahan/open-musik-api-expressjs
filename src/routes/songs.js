const express = require("express");
const router = express.Router();

const {
  addSong,
  getAllSong,
  getSongById,
  editSongById,
  deleteSongById,
} = require("../controllers/SongController");
const { isLoggin } = require("../middlewares/user");

router.route("/song").post(isLoggin, addSong).get(isLoggin, getAllSong);

router
  .route("/song/:songId")
  .get(isLoggin, getSongById)
  .put(isLoggin, editSongById)
  .delete(isLoggin, deleteSongById);

module.exports = router;
