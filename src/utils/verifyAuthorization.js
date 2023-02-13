const { Pool } = require("pg");
const _pool = new Pool();
const AuthorizationError = require("../exception/AuthorizationError");
const NotFoundError = require("../exception/NotFoundError");

const verifyAccess = {
  _verifyOwner: async (userId, playlistId) => {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1 AND owner = $2",
      values: [playlistId, userId],
    };

    const result = await _pool.query(query);

    if (result.rows.length < 1) {
      throw new AuthorizationError("You dont have access to this source! (o)");
    }
  },
  _verifyCollaborator: async (userId, playlistId) => {
    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };
    const result = await _pool.query(query);
    if (result.rows.length < 1) {
      throw new AuthorizationError("You don't have access to this source! (c)");
    }
  },

  _verifyAccessColab: async (userId, playlistId) => {
    try {
      await verifyAccess._verifyOwner(userId, playlistId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await verifyAccess._verifyCollaborator(userId, playlistId);
      } catch {
        throw error;
      }
    }
  },
};

module.exports = verifyAccess;
