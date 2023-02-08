/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("songs", {
    year: {
      type: "integer",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("songs", "year");
};
