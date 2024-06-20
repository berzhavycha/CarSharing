import { FC } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import styled from 'styled-components';

export const CheckIcon: FC = () => {
  return (
    <CheckIconWrapper>
      <FaCheckCircle />
    </CheckIconWrapper>
  );
};

type IconProps = {
  right?: number;
};

export const CheckIconWrapper = styled.span<IconProps>`
  color: green;
  position: absolute;
  right: ${(props): string => `${props.right}px`};
`;
