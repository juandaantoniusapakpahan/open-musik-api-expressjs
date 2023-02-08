const Joi = require("joi");
const InvariantError = require("../../exception/InvariantError");

const logginSchema = {
  _varifyPayload: ({ email, password }) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const result = schema.validate({ email, password });
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = logginSchema;
