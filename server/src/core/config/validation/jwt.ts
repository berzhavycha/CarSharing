import * as Joi from 'joi';

export const jwtValidationSchema = Joi.object({
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_TIME: Joi.string().default('10m'),
  JWT_REFRESH_TOKEN_TIME: Joi.string().default('30d'),
});
