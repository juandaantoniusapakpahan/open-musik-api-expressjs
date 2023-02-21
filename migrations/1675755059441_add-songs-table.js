/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    genre: {
      type: "TEXT",
      notNull: true,
    },
    performer: {
      type: "TEXT",
      notNull: true,
    },
    duration: {
      type: "integer",
    },
    album_id: {
      type: "VARCHAR(50)",
    },
    added_at: {
      type: "TEXT",
    },
    image_id: {
      type: "TEXT",
    },
    secure_url: {
      type: "TEXT",
    },
  });

  pgm.addConstraint(
    "songs",
    "songs.album.id",
    "FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("songs");
  pgm.dropConstraint("songs", "songs.album.id");
};
