import { FC } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import styled from 'styled-components';

type Props = {
  right?: number;
};

export const CSCommonErrorIcon: FC<Props> = ({ right }) => {
  return (
    <ErrorIconWrapper $right={right}>
      <FaExclamationCircle />
    </ErrorIconWrapper>
  );
};

type IconProps = {
  $right?: number;
};

export const ErrorIconWrapper = styled.span<IconProps>`
  color: red;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: ${(props): string => `${props.$right}px`};
`;
