import { ZodError } from 'zod';

import { buildEnvProxy } from './buildEnvProxy.ts';
import { Config, parseConfig } from './config.schema.ts';

const ENV = buildEnvProxy<Record<string, unknown>>(import.meta.env, (key) => `VITE_${key}`);

export let Env: Config;

try {
  Env = parseConfig(ENV);
} catch (error) {
  if (error instanceof ZodError) {
    error.errors.forEach((err) => {
      console.error('Env Validation Failed:', err.message);
    });
  }
}
