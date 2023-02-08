/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    email: {
      type: "VARCHAR(100)",
      notNull: true,
      unique: true,
    },
    password: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    role: {
      type: "VARCHAR(100)",
      nonNull: true,
    },
    created_at: {
      type: "TEXT",
    },
    forgotPasswordToken: {
      type: "TEXT",
    },
    forgotPasswordExpiry: {
      type: "TEXT",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
