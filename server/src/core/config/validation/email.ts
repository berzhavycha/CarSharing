import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  EMAIL_CONFIRMATION_URL: Joi.string().required(),
});
