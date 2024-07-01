import { FieldErrorsState } from '@/types/error';

import { UNEXPECTED_ERROR_MESSAGE } from '../../constants';

const defaultFieldErrorsState = <T extends object>(): FieldErrorsState<T> => {
  const state: FieldErrorsState<T> = {
    unexpectedError: '',
  } as FieldErrorsState<T>;
  return state;
};

export const pickErrorMessages = <T extends object>(
  inputErrorMessages: string[],
  fieldMappings: Record<string, keyof T>,
): FieldErrorsState<T> => {
  const fieldErrors: FieldErrorsState<T> = defaultFieldErrorsState<T>();

  inputErrorMessages.forEach((error) => {
    const lowerCaseError = error.toLowerCase();
    for (const key in fieldMappings) {
      if (lowerCaseError.includes(key) && !fieldErrors[fieldMappings[key]]) {
        (fieldErrors[fieldMappings[key]] as string) = error;
        return;
      }
    }

    if (!fieldErrors.unexpectedError) {
      fieldErrors.unexpectedError = UNEXPECTED_ERROR_MESSAGE;
    }
  });

  return fieldErrors;
};
