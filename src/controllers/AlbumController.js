const { nanoid } = require("nanoid");
const BigPromise = require("../middlewares/bigPromise");
const AlbumValidator = require("../domain/album/AlbumValidator");
const ClientError = require("../exception/ClientError");
const { Pool } = require("pg");
const NotFoundError = require("../exception/NotFoundError");

// Object
const _pool = new Pool();
const _validator = new AlbumValidator();

/** POST Album */
exports.addAlbum = BigPromise(async (req, res, next) => {
  try {
    _validator._verifyPayload(req.body);
    const { name, year } = req.body;
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const query = {
      text: "INSERT INTO albums VALUES ($1, $2, $3, $4) RETURNING id, name, year, created_at",
      values: [id, name, year, createdAt],
    };
    const albumResult = await _pool.query(query);
    const album = albumResult.rows[0];
    res.status(201).json({
      status: "success",
      message: "Successfully added album",
      data: {
        album,
      },
    });
  } catch (error) {
    next(error);
  }
});

/** PUT ALBUM */
exports.editAlbum = BigPromise(async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const { name, year } = req.body;

    const queryCheck = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [albumId],
    };

    const resultCheck = await _pool.query(queryCheck);

    if (resultCheck.rows.length < 1) {
      throw new NotFoundError("No album found");
    }

    const queryUpdate = {
      text: "UPDATE albums set name = $1, year = $2 WHERE id = $3 RETURNING id, name, year",
      values: [name, year, albumId],
    };

    const resultUpdate = await _pool.query(queryUpdate);
    const album = resultUpdate.rows[0];

    res.status(200).json({
      status: "success",
      message: "Album was updated",
      data: { album },
    });
  } catch (error) {
    next(error);
  }
});

/** GET ALL ALBUM */
exports.getAllAlbums = BigPromise(async (req, res, next) => {
  const resultAlbums = await _pool.query("SELECT * FROM albums");
  const albums = resultAlbums.rows;
  res.status(200).json({
    status: "success",
    data: {
      albums,
    },
  });
});

/** GET ALBUM BY ID */
exports.getAlbumById = BigPromise(async (req, res, next) => {
  try {
    const { albumId } = req.params;

    // album
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [albumId],
    };

    const resultAlbum = await _pool.query(query);

    if (resultAlbum.rows.length < 1) {
      throw new NotFoundError("No album found");
    }
    const album = resultAlbum.rows[0];

    // songs
    const querySong = {
      text: "SELECT id, title, performer FROM songs WHERE album_id = $1",
      values: [albumId],
    };

    const resultSong = await _pool.query(querySong);
    const songs = resultSong.rows;

    // merge album and song
    album.songs = songs;

    res.status(200).json({
      status: "success",
      data: {
        album,
      },
    });
  } catch (error) {
    next(error);
  }
});

/** DELETE ALBUM BY ID */
exports.deleteAlbumById = BigPromise(async (req, res, next) => {
  try {
    const { albumId } = req.params;

    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [albumId],
    };

    const resultAlbum = await _pool.query(query);

    if (resultAlbum.rows.length < 1) {
      throw new NotFoundError("No album found");
    }

    res.status(200).json({
      status: "success",
      message: "Album was deleted",
    });
  } catch (error) {
    next(error);
  }
});
