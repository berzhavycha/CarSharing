import * as Joi from 'joi';

import { appValidationSchema } from './app';

export const configValidationSchema = Joi.object().concat(appValidationSchema);
