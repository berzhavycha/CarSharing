import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { Env } from '@/core';
import { UNAUTHORIZED_ERROR_CODE } from '@/helpers';

export const refreshTokenInterceptor = {
  onFulfilled: (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  onRejected: async (error: AxiosError): Promise<AxiosResponse | AxiosError> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === UNAUTHORIZED_ERROR_CODE &&
      !originalRequest.url?.includes('sign-in') &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axios.post(`${Env.API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
};
