import { ServiceUserResponse } from '@/app/stores';
import { AuthenticatedUser, FieldErrorsState } from '@/types';

export const handleUserResponse = <T extends object>(
  response: ServiceUserResponse<T>,
  onSuccess: (user: AuthenticatedUser) => void,
  onError: (errors: FieldErrorsState<T>) => void,
): void => {
  if (response.user) {
    onSuccess(response.user);
  } else if (response.errors) {
    onError(response.errors);
  }
};
