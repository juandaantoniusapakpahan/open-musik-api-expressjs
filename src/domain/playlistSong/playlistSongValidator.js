const Joi = require("joi");
const InvariantError = require("../../exception/InvariantError");

const playlistSongValidator = {
  _verifyPayload: (payload) => {
    const schema = Joi.object({
      songId: Joi.string().required(),
    });

    const result = schema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = playlistSongValidator;
