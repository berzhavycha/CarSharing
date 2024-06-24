import { UserDto } from '@/types';
import { FieldErrorsState } from '@/types/error';
import { UNEXPECTED_ERROR_MESSAGE } from '../constants';

const fieldMappings: Record<string, keyof UserDto> = {
  'email': 'email',
  'password': 'password',
  'role': 'role',
  'firstname': 'firstName',
  'lastname': 'lastName',
  'invitation code': 'invitationCode'
};

export const pickUserErrorMessages = (inputErrorMessages: string[]): FieldErrorsState<UserDto> => {
  const fieldErrors: FieldErrorsState<UserDto> = {
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    password: '',
    unexpectedError: '',
  };

  inputErrorMessages.forEach((error) => {
    const lowerCaseError = error.toLowerCase();

    for (const key in fieldMappings) {
      if (lowerCaseError.includes(key) && !fieldErrors[fieldMappings[key]]) {
        fieldErrors[fieldMappings[key]] = error;
        return;
      }
    }

    if (!fieldErrors.unexpectedError) {
      fieldErrors.unexpectedError = UNEXPECTED_ERROR_MESSAGE;
    }
  });

  return fieldErrors;
};
