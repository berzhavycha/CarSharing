import { zodResolver } from '@hookform/resolvers/zod';
import { BaseSyntheticEvent, createContext, PropsWithChildren, useContext } from 'react';
import { DefaultValues, FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { ZodSchema } from 'zod';

import { CSCommonFormInput } from './cs-common-form-input';
import { CSCommonFormInputImage } from './cs-common-form-input-image';
import { CSCommonFormSelect } from './cs-common-form-select';
import { CSCommonFormSubmitButton } from './cs-common-form-submit-button';
import { CSCommonFormTextArea } from './cs-common-form-textarea';

type ContextType<TEntity extends FieldValues> = {
  formHandle: UseFormReturn<TEntity>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomFormContext = createContext<ContextType<any> | null>(null);

export const useCommonForm = <TUser extends FieldValues>(): ContextType<TUser> => {
  const context = useContext(CustomFormContext);

  if (!context) {
    throw new Error('useCommonForm must be used within an CSCommonForm');
  }

  return context;
};

type Props<TEntity extends FieldValues> = PropsWithChildren & {
  validationSchema: ZodSchema<TEntity>;
  onSubmit: (user: TEntity) => void;
  defaultValues?: DefaultValues<TEntity>;
};

export const CSCommonForm = <TEntity extends FieldValues>({
  validationSchema,
  children,
  onSubmit,
  defaultValues,
}: Props<TEntity>): JSX.Element => {
  const formHandle = useForm<TEntity>({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
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

CSCommonForm.Input = CSCommonFormInput;
CSCommonForm.InputFile = CSCommonFormInputImage;
CSCommonForm.SubmitButton = CSCommonFormSubmitButton;
CSCommonForm.Select = CSCommonFormSelect;
CSCommonForm.TextArea = CSCommonFormTextArea;
