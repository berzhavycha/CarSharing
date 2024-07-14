import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  NODE_ENV: Joi.string().default('development'),
  PORT: Joi.number().default(4000),
  CORS_ORIGIN: Joi.string().required(),
  UPLOADED_FILES_DESTINATION: Joi.string().default('uploads'),
  ADMIN_INVITATION_CODE: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
});
