import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  NODE_ENV: Joi.string().default('development'),
  PORT: Joi.number().default(4000),
  CORS_ORIGIN: Joi.string().required(),
  ADMIN_INVITATION_CODE: Joi.string().required(),
  LAMBDA_AWS_REGION: Joi.string().required(),
  LAMBDA_AWS_ACCESS_KEY_ID: Joi.string().required(),
  LAMBDA_AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
});
