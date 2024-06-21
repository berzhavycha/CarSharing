import { FC } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import styled from 'styled-components';

type Props = {
  right?: number;
};

export const CheckIcon: FC<Props> = ({ right }) => {
  return (
    <CheckIconWrapper right={right}>
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
