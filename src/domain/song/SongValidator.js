const Joi = require("joi");
const InvariantError = require("../../exception/InvariantError");

const songValidatorPayload = {
  _songValidate: (payload) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      year: Joi.number().integer().required(),
      genre: Joi.string().required(),
      performer: Joi.string().required(),
      duration: Joi.number(),
      albumId: Joi.string(),
    });

    const result = schema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = songValidatorPayload;
