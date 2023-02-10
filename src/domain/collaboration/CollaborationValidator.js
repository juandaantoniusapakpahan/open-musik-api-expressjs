const Joi = require("joi");
const InvariantError = require("../../exception/InvariantError");

const CollaborationValidator = {
  _verifyPayload: (payload) => {
    const schema = Joi.object({
      playlistId: Joi.string().required(),
      userId: Joi.string().required(),
    });

    const result = schema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = CollaborationValidator;
