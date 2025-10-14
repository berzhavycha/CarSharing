import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  NODE_ENV: Joi.string().default('development'),
  PORT: Joi.number().default(4001),
  AUTH_SERVICE_HOST: Joi.string().default('0.0.0.0'),
  AUTH_SERVICE_PORT: Joi.number().default(4002),
});
