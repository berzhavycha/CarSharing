import { ZodError } from 'zod';
import { buildEnvProxy } from './buildEnvProxy.ts';
import { Config, parseConfig } from './config.schema.ts';


const ENV = buildEnvProxy<Record<string, unknown>>(
    import.meta.env,
    (key) => `VITE_${key}`,
);

let CONFIG: unknown;

try {
    CONFIG = parseConfig(ENV);
} catch (error) {
    if (error instanceof ZodError) {
        error.errors.forEach(err => {
            console.error('Env Validation Failed:', err.message);
        })
    }
}

export const CONFIG_TYPED = CONFIG as Config;

