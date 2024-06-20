import { FC } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import styled from 'styled-components';

export const ErrorIcon: FC = () => {
  return (
    <ErrorIconWrapper>
      <FaExclamationCircle />
    </ErrorIconWrapper>
  );
};

type IconProps = {
  right?: number;
};

export const ErrorIconWrapper = styled.span<IconProps>`
  color: red;
  position: absolute;
  right: ${(props): string => `${props.right}px`};
`;
