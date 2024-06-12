import * as Joi from 'joi';

import { appValidationSchema } from './app';
import { postgresValidationSchema } from './postgres';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(postgresValidationSchema);
