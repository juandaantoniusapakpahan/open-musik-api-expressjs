/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("collaborations", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "collaborations",
    "collaborations.playlist_id.id",
    "FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "collaborations",
    "collaboration.user_id.id",
    "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("collaborations");
  pgm.dropConstraint("collaborations", "collaborations.playlist_id.id");
  pgm.dropConstraint("collaborations", "collaboration.user_id.id");
};
