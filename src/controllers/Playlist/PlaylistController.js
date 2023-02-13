const BigPromise = require("../../middlewares/bigPromise");
const { Pool } = require("pg");
const _pool = new Pool();
const { nanoid } = require("nanoid");
const ValidatorPlaylist = require("../../domain/playlist/PlaylistValidator");
const NotFoundError = require("../../exception/NotFoundError");
const verifyAccess = require("../../utils/verifyAuthorization");

/** POST Playlist */
exports.addPlaylist = BigPromise(async (req, res, next) => {
  try {
    ValidatorPlaylist._varifyPayload(req.body);
    const playlistId = `playlist-${nanoid(16)}`;
    const { name } = req.body;
    const id = req.user.id;

    const query = {
      text: "INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id, name, owner",
      values: [playlistId, name, id],
    };

    const result = await _pool.query(query);
    const playlist = result.rows[0];

    res.status(201).json({
      status: "success",
      message: "Playlist was created",
      data: {
        playlist,
      },
    });
  } catch (error) {
    next(error);
  }
});

/** GET */
exports.getAllPlaylist = BigPromise(async (req, res, next) => {
  const id = req.user.id;
  const query = {
    text: "SELECT py.id, py.name, usr.name username FROM playlists py left JOIN users usr on py.owner = usr.id WHERE py.owner = $1",
    values: [id],
  };
  const result = await _pool.query(query);
  const playlists = result.rows;

  res.status(200).json({
    status: "success",
    data: {
      playlists,
    },
  });
});

/** DELETE */
exports.deletePlaylistById = BigPromise(async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.id;

    await verifyAccess._verifyOwner(userId, playlistId);

    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [playlistId],
    };

    const result = await _pool.query(query);

    if (result.rows.length < 1) {
      throw new NotFoundError("No playlist found");
    }

    res.status(200).json({
      status: "success",
      message: "Playlist was deleted",
    });
  } catch (error) {
    next(error);
  }
});
