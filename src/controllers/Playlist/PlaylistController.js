const BigPromise = require("../../middlewares/bigPromise");
const { Pool } = require("pg");
const _pool = new Pool();
const { nanoid } = require("nanoid");
const ValidatorPlaylist = require("../../domain/playlist/PlaylistValidator");

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
