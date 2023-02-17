const BigPromise = require("../../middlewares/bigPromise");
const { Pool } = require("pg");
const NotFoundError = require("../../exception/NotFoundError");
const { nanoid } = require("nanoid");

const _pool = new Pool();

exports.likeSong = BigPromise(async (req, res, next) => {
  try {
    const { songId } = req.params;

    const queryCheckSong = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [songId],
    };

    const resultCheckSong = await _pool.query(queryCheckSong);

    if (resultCheckSong.rows.length < 1) {
      throw new NotFoundError("No song found");
    }

    // User id
    const userId = req.user.id;
    const QueryCheckLike = {
      text: "SELECT * FROM song_ld where song_id = $1 AND user_id = $2",
      values: [songId, userId],
    };
    const resultCheckLike = await _pool.query(QueryCheckLike);

    let queryLike = "";
    let arryLike = [];

    if (resultCheckLike.rows.length < 1) {
      const id = nanoid(16);
      const createdAt = new Date().toISOString();
      queryLike = "INSERT INTO song_ld VALUES($1, $2, $3, $4, $5)";
      const array = [id, songId, userId, "like", createdAt];
      arryLike.push(...array);
    }

    if (resultCheckLike.rows.length > 0) {
      queryLike = "DELETE FROM song_ld WHERE song_id = $1 AND user_id = $2";

      arryLike.push(songId, userId);
    }
    const query = {
      text: queryLike,
      values: arryLike,
    };
    await _pool.query(query);

    res.statu(200).json({
      status: "success",
    });

    //
  } catch (error) {
    next(error);
  }
});
