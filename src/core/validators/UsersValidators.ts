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
      repeat: Joi.string().valid(Joi.ref('password')).required(),
    }),

    signInSchema: Joi.object({
      email: Joi.string().email().trim().lowercase().min(12).required(),
      password: Joi.string().min(6).max(32).trim().lowercase().required(),
      repeat: Joi.string().valid(Joi.ref('password')).required(),
    }),

    deleteSchema: Joi.object({
      password: Joi.string().min(6).max(32).trim().lowercase().required(),
      repeat: Joi.string().valid(Joi.ref('password')).required(),
    }),

    changeSchema: Joi.object({
      oldPassword: Joi.string().min(6).max(32).trim().lowercase().required(),
      oldRepeat: Joi.string().valid(Joi.ref('oldPassword')),
      password: Joi.string().min(6).max(32).trim().lowercase().required(),
      repeat: Joi.string().valid(Joi.ref('password')).required(),
    }),

    forgotShema: Joi.object({
      email: Joi.string().email().trim().lowercase().min(12).required(),
    }),

    resetSchema: Joi.object({
      password: Joi.string().min(6).max(32).trim().lowercase().required(),
      repeat: Joi.string().valid(Joi.ref('password')).required(),
      token: Joi.string().trim().lowercase().required(),
    }),
  },
};

export { account };
