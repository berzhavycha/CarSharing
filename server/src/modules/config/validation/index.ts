import * as Joi from 'joi';

import { appValidationSchema } from './app';
import { authValidationSchema } from './auth';
import { jwtValidationSchema } from './jwt';
import { postgresValidationSchema } from './postgres';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(postgresValidationSchema)
  .concat(jwtValidationSchema)
  .concat(authValidationSchema);
