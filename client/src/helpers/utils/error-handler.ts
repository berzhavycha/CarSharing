import { AxiosError } from 'axios';

import { FieldErrorsState } from '@/types';

import { UNEXPECTED_ERROR_MESSAGE } from '../constants';

import { pickErrorMessages } from './pick-error-messages';

export const errorHandler = <T extends object>(
  error: unknown,
  fieldMappings: Record<string, keyof T>,
): FieldErrorsState<T> => {
  if (error instanceof AxiosError) {
    return pickErrorMessages([error.response?.data.message], fieldMappings);
  }
  return { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
};
