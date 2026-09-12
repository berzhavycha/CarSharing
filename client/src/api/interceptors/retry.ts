import axiosRetry from 'axios-retry';
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const IDEMPOTENT_WRITE_ENDPOINTS: { method: string; pattern: RegExp }[] = [
  { method: 'patch', pattern: /^\/users\/[^/]+\/top-up$/ },  // PATCH /users/:id/top-up
  { method: 'post',  pattern: /^\/rentals$/ },                // POST  /rentals
  { method: 'patch', pattern: /^\/rentals\/[^/]+$/ },         // PATCH /rentals/:id
];

const isRetryable = (config: InternalAxiosRequestConfig): boolean => {
  const method = config.method?.toLowerCase() ?? '';
  const url = config.url ?? '';

  if (method === 'get') return true;

  return IDEMPOTENT_WRITE_ENDPOINTS.some(
    endpoint => endpoint.method === method && endpoint.pattern.test(url)
  );
};

const isTransientError = (error: AxiosError): boolean => {
  if (!error.response) return true; // network error / timeout
  return [429, 502, 503, 504].includes(error.response.status);
};

const getRetryDelay = (retryCount: number, error: AxiosError): number => {
  const retryAfter = error.response?.headers['retry-after'];
  if (retryAfter) {
    return Number(retryAfter) * 1000; // server says exactly when, respect it
  }

  const base = axiosRetry.exponentialDelay(retryCount); // 200ms → 400ms → 800ms
  const jitter = Math.random() * 200;
  return base + jitter;
};

export const applyRetryInterceptor = (instance: AxiosInstance): void => {
  axiosRetry(instance, {
    retries: 3,
    retryCondition: (error) => isTransientError(error) && isRetryable(error.config!),
    retryDelay: (retryCount, error) => getRetryDelay(retryCount, error),
    onRetry: (retryCount, error, requestConfig) => {
      console.warn(
        `[Retry ${retryCount}/3] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`,
        `— status: ${error.response?.status ?? 'network error'}`
      );
    },
  });
};