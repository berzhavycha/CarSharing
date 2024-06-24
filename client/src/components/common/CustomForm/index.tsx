import { zodResolver } from '@hookform/resolvers/zod';
import { BaseSyntheticEvent, createContext, PropsWithChildren, useContext } from 'react';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { ZodSchema } from 'zod';

import { Input } from './Input';
import { InputImage } from './InputImage';
import { Select } from './Select';
import { SubmitButton } from './SubmitButton';

type ContextType<TEntity extends FieldValues> = {
  formHandle: UseFormReturn<TEntity>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomFormContext = createContext<ContextType<any> | null>(null);

export const useCustomForm = <TUser extends FieldValues>(): ContextType<TUser> => {
  const context = useContext(CustomFormContext);

  if (!context) {
    throw new Error('useAuthForm must be used within an AuthForm');
  }

  return context;
};

type Props<TEntity extends FieldValues> = PropsWithChildren & {
  validationSchema: ZodSchema<TEntity>;
  onSubmit: (user: TEntity) => void;
};

export const CustomForm = <TEntity extends FieldValues>({
  validationSchema,
  children,
  onSubmit,
}: Props<TEntity>): JSX.Element => {
  const formHandle = useForm<TEntity>({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
  });

  const contextValue: ContextType<TEntity> = {
    formHandle: formHandle,
  };

  const submitHandler = (data: TEntity, e?: BaseSyntheticEvent): void => {
    e?.preventDefault();
    onSubmit(data);
  };

  const onFormSubmit = formHandle.handleSubmit(submitHandler);

  return (
    <CustomFormContext.Provider value={contextValue}>
      <form onSubmit={onFormSubmit}>{children}</form>
    </CustomFormContext.Provider>
  );
};

CustomForm.Input = Input;
CustomForm.InputFile = InputImage;
CustomForm.SubmitButton = SubmitButton;
CustomForm.Select = Select;
