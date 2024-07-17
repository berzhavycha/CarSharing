import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  NODE_ENV: Joi.string().default('development'),
  PORT: Joi.number().default(4000),
  CORS_ORIGIN: Joi.string().required(),
  ADMIN_INVITATION_CODE: Joi.string().required(),
  CLOUDINARY_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
});