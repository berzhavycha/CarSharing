export const buildEnvProxy = <T extends Record<string, unknown>>(
    source: T,
    transformKey: (key: string) => string,
): T =>
    new Proxy({} as T, {
        get(_: T, key: string | symbol): unknown {
            const keyStr = String(key);
            const envKey = transformKey ? transformKey(keyStr) : keyStr;

            return source[envKey];
        },
    });
