const express = require("express");
const router = express.Router();

const {
  addAlbum,
  editAlbum,
  getAllAlbums,
  getAlbumById,
  deleteAlbumById,
} = require("../controllers/AlbumController");

/** ALBUM */
router.route("/album").post(addAlbum).get(getAllAlbums);
router
  .route("/album/:albumId")
  .put(editAlbum)
  .get(getAlbumById)
  .delete(deleteAlbumById);

module.exports = router;
