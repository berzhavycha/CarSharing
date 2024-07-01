import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonTextArea, TextAreasProps } from '@/components/cs-common';

import { useCommonForm } from './cs-common-form';

type Props = Omit<TextAreasProps, 'name'> & {
  name: string;
};

export const CSCommonFormTextArea: FC<Props> = ({ name, label, error, ...props }) => {
  const {
    register,
    formState: { errors, isSubmitted },
  } = useCommonForm().formHandle;

  const errorMessage = errors[name]?.message as string;
  const errorText = errorMessage || error;

  return (
    <FormBlock>
      <CSCommonTextArea
        {...props}
        {...register(name)}
        label={label}
        error={errorText}
        formSubmitted={isSubmitted}
        autoComplete="off"
      />
    </FormBlock>
  );
};

export const FormBlock = styled.div`
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  position: relative;
`;
