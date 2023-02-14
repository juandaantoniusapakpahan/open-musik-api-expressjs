const { Pool } = require("pg");
const { nanoid } = require("nanoid");

const _pool = new Pool();

const PlaylistActivities = {
  _addPlaylistActivities: async (playlist_id, song_id, user_id, action) => {
    try {
      const id = `activities-${nanoid(16)}`;
      const time = new Date().toISOString();

      const query = {
        text: "INSERT INTO playlist_activities VALUES($1, $2, $3, $4, $5, $6)",
        values: [id, playlist_id, song_id, user_id, action, time],
      };

      await _pool.query(query);
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = PlaylistActivities;
