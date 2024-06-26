import { FC } from 'react';

import { CSCommonSelectField, SelectProps } from '@/components/cs-common';

import { FormBlock } from './cs-common-form-input';

import { useCommonForm } from './cs-common-form';

type Props = Omit<SelectProps, 'name'> & {
    name: string;
};

export const CSCommonFormSelect: FC<Props> = ({ name, label, onChange, error, ...props }) => {
    const {
        register,
        formState: { errors },
    } = useCommonForm().formHandle;

    const errorMessage = errors[name]?.message as string;
    const errorText = errorMessage || error;

    return (
        <FormBlock>
            <CSCommonSelectField
                {...props}
                {...register(name, {
                    onChange,
                })}
                label={label}
                error={errorText}
                autoComplete="off"
            />
        </FormBlock>
    );
};
