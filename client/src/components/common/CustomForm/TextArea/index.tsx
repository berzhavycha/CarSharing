import { FC } from 'react';
import styled from 'styled-components';

import { TextAreasProps, TextField } from '../../TextField';

import { useCustomForm } from '..';

type Props = Omit<TextAreasProps, 'name'> & {
  name: string;
};

export const TextArea: FC<Props> = ({ name, label, error, ...props }) => {
  const {
    register,
    formState: { errors, isSubmitted },
  } = useCustomForm().formHandle;

  const errorMessage = errors[name]?.message as string;
  const errorText = errorMessage || error;

  return (
    <FormBlock>
      <TextField
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
