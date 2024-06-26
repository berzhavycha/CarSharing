import axios from 'axios';

import { Env } from '@/core';

import { refreshTokenInterceptor } from './interceptors';

export const axiosInstance = axios.create({
  baseURL: Env.API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  refreshTokenInterceptor.onFulfilled,
  refreshTokenInterceptor.onRejected,
);
