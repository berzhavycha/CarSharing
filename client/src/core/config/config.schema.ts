import { z } from 'zod';

const configSchema = z.object({
    API_BASE_URL: z.string().refine((value) => value.trim() !== '', {
        message: 'API_BASE_URL cannot be an empty string',
    }),
});

export type Config = z.infer<typeof configSchema>

export const parseConfig = (configObj: Record<string, unknown>): Config => {
    const parseResult = configSchema.safeParse(configObj);

    if (!parseResult.success) throw parseResult.error;

    return parseResult.data;
};