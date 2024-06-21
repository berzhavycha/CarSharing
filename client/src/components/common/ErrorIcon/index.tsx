import { FC } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import styled from 'styled-components';

type Props = {
  right?: number;
};

export const ErrorIcon: FC<Props> = ({ right }) => {
  return (
    <ErrorIconWrapper right={right}>
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
