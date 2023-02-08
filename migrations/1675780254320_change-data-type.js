/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn("songs", "title", {
    type: "TEXT",
    notNull: true,
  });
};

exports.down = (pgm) => {};
