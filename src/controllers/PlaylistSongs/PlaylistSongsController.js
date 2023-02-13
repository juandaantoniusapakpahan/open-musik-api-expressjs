const BigPromise = require("../../middlewares/bigPromise");
const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const verifyAuthorization = require("../../utils/verifyAuthorization");
const playlistSongValidator = require("../../domain/playlistSong/playlistSongValidator");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/NotFoundError");

const _pool = new Pool();

exports.addPlaylistSong = BigPromise(async (req, res, next) => {
  try {
    playlistSongValidator._verifyPayload(req.body);
    const userId = req.user.id;
    const playlistId = req.params.playlistId;
    const { songId } = req.body;
    console.log(userId, playlistId);

    await verifyAuthorization._verifyAccessColab(userId, playlistId);

    const id = `playlist-song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const queryCheckList = {
      text: "SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2",
      values: [playlistId, songId],
    };

    const resultCheckList = await _pool.query(queryCheckList);
    if (resultCheckList.rows.length > 0) {
      throw new InvariantError("Song has been added");
    }

    const query = {
      text: "INSERT INTO playlist_songs VALUES ($1, $2, $3, $4) RETURNING id",
      values: [id, playlistId, songId, createdAt],
    };

    const resultQuery = await _pool.query(query);
    const playlist_song = resultQuery.rows[0];

    res.status(201).json({
      status: "success",
      message: "Song was added to playlist",
      data: {
        playlist_song,
      },
    });
  } catch (error) {
    next(error);
  }
});

exports.getPlaylistSong = BigPromise(async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const query = {
      text: `SELECT py.id, py.name, us.name FROM playlists py
    join users us on py.owner = us.id WHERE py.id = $1`,
      values: [playlistId],
    };

    const result = await _pool.query(query);

    if (result.rows.length < 1) {
      throw new NotFoundError("No found playlist");
    }

    const querySong = {
      text: `SELECT sg.id, sg.title, sg.performer FROM playlist_songs ps
    JOIN songs sg on ps.song_id = sg.id WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const resultSong = await _pool.query(querySong);

    const playlist = result.rows[0];
    playlist.songs = resultSong.rows;

    res.status(200).json({
      status: "success",
      data: {
        playlist,
      },
    });
  } catch (error) {
    next(error);
  }
});

exports.deletePlaylistSong = BigPromise(async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { songId } = req.body;
    const userId = req.user.id;

    await verifyAuthorization._verifyAccessColab(userId, playlistId);

    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await _pool.query(query);

    if (result.rows.length < 1) {
      throw new NotFoundError("No found song");
    }

    res.status(200).json({
      status: "success",
      message: "Successful delete song",
    });
  } catch (error) {
    next(error);
  }
});
