/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.crateTable("playlist_songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    song_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {};
