import { FC } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import styled from 'styled-components';

type Props = {
  right?: number;
};

export const CSCommonCheckIcon: FC<Props> = ({ right }) => {
  return (
    <CheckIconWrapper $right={right}>
      <FaCheckCircle />
    </CheckIconWrapper>
  );
};

type IconProps = {
  $right?: number;
};

export const CheckIconWrapper = styled.span<IconProps>`
  color: green;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: ${(props): string => `${props.$right}px`};
`;
