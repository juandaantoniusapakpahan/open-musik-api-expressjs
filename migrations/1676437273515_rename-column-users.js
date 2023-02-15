/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameColumn("users", "forgotPasswordToken", "forgotpasswordtoken");
  pgm.renameColumn("users", "forgotPasswordExpiry", "forgotpasswordexpiry");
};
