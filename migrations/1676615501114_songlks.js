exports.up = (pgm) => {
  pgm.createTable("song_ld", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    song_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    status: {
      type: "TEXT",
      notNull: true,
    },
    created_at: {
      type: "TEXT",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "song_ld",
    "song_ld.song_id.id",
    "FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "song_ld",
    "song_ld.user_id.id",
    "FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("song_ld");
  pgm.dropConstraint("song_ld", "song_ld.song_id.id");
  pgm.dropConstraint("song_ld", "song_ld.user_id.id");
};
