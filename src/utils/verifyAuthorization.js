const { Pool } = require("pg");
const _pool = new Pool();
const AuthorizationError = require("../exception/AuthorizationError");

const verifyAccess = {
  _verifyOwner: async (userId, playlistId) => {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1 AND owner = $2",
      values: [playlistId, userId],
    };

    const result = await _pool.query(query);

    if (result.rows.length < 1) {
      throw new AuthorizationError("You dont have access to this source!");
    }
  },
};

module.exports = verifyAccess;
