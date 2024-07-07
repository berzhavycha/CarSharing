import { FC } from 'react';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

type Props = {
  onClose: () => void;
  color?: string;
};

export const CSCommonCloseButton: FC<Props> = ({ onClose, color = 'var(--light-dark)' }) => {
  return (
    <CloseButton onClick={onClose} $color={color}>
      <FaTimes />
    </CloseButton>
  );
};

type ButtonProps = {
  $color: string;
};

export const CloseButton = styled.button<ButtonProps>`
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${(props): string => props.$color};
  transition: var(--default-transition);

  &:hover {
    color: var(--dark);
  }
`;
