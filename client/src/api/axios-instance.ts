import axios from 'axios';
import { Env } from '@/core';
import { refreshTokenInterceptor } from './interceptors';
import { applyRetryInterceptor } from './interceptors/retry';

export const axiosInstance = axios.create({
  baseURL: Env.API_BASE_URL,
  withCredentials: true,
  timeout: 10_000,
});

axiosInstance.interceptors.response.use(
  refreshTokenInterceptor.onFulfilled,
  refreshTokenInterceptor.onRejected,
);

applyRetryInterceptor(axiosInstance);