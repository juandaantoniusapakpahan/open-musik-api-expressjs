const BigPromise = require("../middlewares/bigPromise");
const InvariantError = require("../exception/InvariantError");
const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const songValidatorPayload = require("../domain/song/SongValidator");
const NotFoundError = require("../exception/NotFoundError");

const _pool = new Pool();

/** POST Song */
exports.addSong = BigPromise(async (req, res, next) => {
  try {
    songValidatorPayload._songValidate(req.body);

    const { title, year, genre, performer, duration, albumId } = req.body;

    const id = `song-${nanoid(16)}`;
    const added_at = new Date().toISOString();
    const query = {
      text: "INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, title, genre, performer, duration, album_id, year",
      values: [id, title, genre, performer, duration, albumId, added_at, year],
    };

    const result = await _pool.query(query);
    const song = result.rows[0];

    res.status(201).json({
      status: "success",
      message: "Album was created",
      data: {
        song,
      },
    });
  } catch (error) {
    next(error);
  }
});

/** GET All Song */
exports.getAllSong = BigPromise(async (req, res, next) => {
  const result = await _pool.query("SELECT * FROM songs");
  const songs = result.rows;

  res.status(200).json({
    status: "success",
    data: {
      songs,
    },
  });
});

/** GET Song By Id */
exports.getSongById = BigPromise(async (req, res, next) => {
  try {
    const { songId } = req.params;

    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [songId],
    };

    const result = await _pool.query(query);

    if (result.rows.length < 1) {
      throw new NotFoundError("No song found!");
    }

    const song = result.rows[0];

    res.status(200).json({
      status: "success",
      data: {
        song,
      },
    });
  } catch (error) {
    next(error);
  }
});

/** PUT Song By Id */
exports.editSongById = BigPromise(async (req, res, next) => {
  songValidatorPayload._songValidate(req.body);
  const { songId } = req.params;
  const { title, year, genre, performer, duration, albumId } = req.body;

  const queryCheckSongg = {
    text: "SELECT * FROM songs WHERE id = $1",
    values: [songId],
  };

  const resultCheckSong = await _pool.query(queryCheckSongg);

  try {
    // condition
    if (resultCheckSong.rows.length < 1) {
      throw new NotFoundError("No song found");
    }

    const queryUpdate = {
      text: "UPDATE songs set title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING *",
      values: [title, year, genre, performer, duration, albumId, songId],
    };

    const resultUpdate = await _pool.query(queryUpdate);
    const song = resultUpdate.rows[0];

    res.status(200).json({
      status: "success",
      message: "Song was updated",
      data: {
        song,
      },
    });
  } catch (error) {
    next(error);
  }
});

/** DELETE Song By Id */
exports.deleteSongById = BigPromise(async (req, res, next) => {
  try {
    const { songId } = req.params;

    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [songId],
    };

    const result = await _pool.query(query);

    // condition
    if (result.rows.length < 1) {
      throw new NotFoundError("No song found");
    }

    res.status(200).json({
      status: "success",
      message: "Song was deleted",
    });
  } catch (error) {
    next(error);
  }
});
