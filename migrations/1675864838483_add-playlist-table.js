/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlists", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
    },
  });

  pgm.addConstraint(
    "playlists",
    "playlists.user.id",
    "FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE "
  );
};

exports.down = (pgm) => {
  pgm.dropTable("playlists");
  pgm.dropConstraint("playlists", "playlists.user.id");
};
