import { zodResolver } from '@hookform/resolvers/zod';
import { BaseSyntheticEvent, createContext, PropsWithChildren, useContext } from 'react';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { ZodSchema } from 'zod';

import { Input } from '../Input';
import { Select } from '../Select';
import { SubmitButton } from '../SubmitButton';

type ContextType<TUser extends FieldValues> = {
  formHandle: UseFormReturn<TUser>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthFormContext = createContext<ContextType<any> | null>(null);


export const useAuthForm = <TUser extends FieldValues>(): ContextType<TUser> => {
  const context = useContext(AuthFormContext);

  if (!context) {
    throw new Error('useAuthForm must be used within an AuthForm');
  }

  return context as ContextType<TUser>;
};

type Props<TUser extends FieldValues> = PropsWithChildren & {
  validationSchema: ZodSchema<TUser>;
  onSubmit: (user: TUser) => void;
};

export const AuthForm = <TUser extends FieldValues>({
  validationSchema,
  children,
  onSubmit,
}: Props<TUser>): JSX.Element => {
  const formHandle = useForm<TUser>({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
  });

  const contextValue: ContextType<TUser> = {
    formHandle: formHandle,
  };

  const submitHandler = (data: TUser, e?: BaseSyntheticEvent): void => {
    e?.preventDefault();
    onSubmit(data);
  };

  const onFormSubmit = formHandle.handleSubmit(submitHandler);

  return (
    <AuthFormContext.Provider value={contextValue}>
      <form onSubmit={onFormSubmit}>{children}</form>
    </AuthFormContext.Provider>
  );
};

AuthForm.Input = Input;
AuthForm.SubmitButton = SubmitButton;
AuthForm.Select = Select;
