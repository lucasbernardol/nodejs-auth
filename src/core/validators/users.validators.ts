import Joi from 'joi';

export default {
  body: {
    signIn: Joi.object({
      email: Joi.string().email().trim().lowercase().min(12).required(),
      password: Joi.string().min(6).max(32).trim().lowercase().required(),
    }),

    create: Joi.object({
      name: Joi.string().min(5).max(120).trim().required(),
      username: Joi.string().min(5).max(32).trim().lowercase().required(),
      email: Joi.string().email().trim().lowercase().min(12).required(),
      password: Joi.string().min(6).max(32).trim().lowercase().required(),
      repeat: Joi.string().valid(Joi.ref('password')).required(),
    }),

    change: Joi.object({
      oldPassword: Joi.string().min(6).max(32).trim().lowercase().required(),
      oldRepeat: Joi.string().valid(Joi.ref('oldPassword')),
      password: Joi.string().min(6).max(32).trim().lowercase().required(),
      repeat: Joi.string().valid(Joi.ref('password')).required(),
    }),

    forgot: Joi.object({
      email: Joi.string().email().trim().lowercase().min(12).required(),
    }),

    delete: Joi.object({
      password: Joi.string().min(6).max(32).trim().lowercase().required(),
      repeat: Joi.string().valid(Joi.ref('password')).required(),
    }),

    reset: Joi.object({
      token: Joi.string().trim().lowercase().required(),
      password: Joi.string().min(6).max(32).trim().lowercase().required(),
      repeat: Joi.string().valid(Joi.ref('password')).required(),
    }),
  },
};
