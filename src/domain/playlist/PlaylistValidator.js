const InvariantError = require("../../exception/InvariantError");
const Joi = require("joi");

const ValidatorPlaylist = {
  _varifyPayload: (payload) => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    const result = schema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = ValidatorPlaylist;
