import * as Joi from 'joi';

import { appValidationSchema } from './app';
import { postgresValidationSchema } from './postgres';
import { jwtValidationSchema } from './jwt';
import { authValidationSchema } from './auth';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(postgresValidationSchema)
  .concat(jwtValidationSchema)
  .concat(authValidationSchema)
