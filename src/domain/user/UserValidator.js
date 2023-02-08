const Joi = require("joi");
const InvariantError = require("../../exception/InvariantError");
const UserValidator = {
  _varifyPayload: ({ name, email, password }) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(7).required(),
    });
    const result = schema.validate({ name, email, password });

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = UserValidator;
