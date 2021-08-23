import Joi from 'joi';

/**
 * @constant
 */
const account = {
  body: {
    signUpSchema: Joi.object({
      name: Joi.string().min(5).max(120).trim().required(),
      username: Joi.string().min(5).max(120).trim().lowercase().required(),
      email: Joi.string().email().trim().lowercase().min(8).required(),
      password: Joi.string().min(6).max(32).trim().lowercase().required(),
      repeat: Joi.ref('password'),
    }),

    signInSchema: Joi.object({
      email: Joi.string().email().trim().lowercase().min(8).required(),
      password: Joi.string().min(6).max(32).trim().lowercase().required(),
      repeat: Joi.ref('password'),
    }),
  },
};

export { account };
