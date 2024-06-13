import * as Joi from 'joi';

export const authValidationSchema = Joi.object({
  LOGIN_FIELD: Joi.string().default('email'),
  AUTH_COOKIE_EXPIRATION_DAYS_TIME: Joi.number().default(90),
});
