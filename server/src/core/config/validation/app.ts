import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  NODE_ENV: Joi.string().default('development'),
  PORT: Joi.number().default(4000),
  CORS_ORIGIN: Joi.string().required(),
  MULTER_DEST: Joi.string().default('/uploads')
});
