import Joi from 'joi';

export default {
  body: {
    create: Joi.object({
      zipcode: Joi.string().min(8).max(8).required(),
      street: Joi.string().min(5).max(120).required(),
      district: Joi.string().min(5).max(120).required(),
      city: Joi.string().min(5).max(120).required(),
      description: Joi.string().min(5).max(255).optional(),
      uf: Joi.string().min(2).max(2).uppercase().optional(),
      number: Joi.number().optional(),
    }),
  },
};
