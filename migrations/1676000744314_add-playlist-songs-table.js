/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlist_songs", {
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
    created_at: {
      type: "TEXT",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "playlist_songs",
    "playlist_songs.playlist_id.id",
    "FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "playlist_songs",
    "playlist_songs.songs_id.id",
    "FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_songs");
  pgm.dropConstraint("playlist_songs", "playlist_songs.playlist_id.id");
  pgm.dropConstraint("playlist_songs", "playlist_songs.user_id.id");
};
