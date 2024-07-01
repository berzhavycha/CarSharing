import { FC } from 'react';
import styled from 'styled-components';

type Props = {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => Promise<void> | void;
  content: string;
  style?: 'main' | 'light'
};

export const CSCommonPrimaryButton: FC<Props> = ({ type, onClick, content, style = 'main' }) => {
  return (
    <Button type={type} onClick={onClick} $style={style}>
      {content}
    </Button>
  );
};

type ButtonProps = {
  $style: string
}

const Button = styled.button<ButtonProps>`
  background-color: ${(props): string => props.$style === 'main' ? '#3563e9' : '#6b90ff'};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: var(--default-transition);

  &:hover {
    background-color: var(--dark-blue);
  }
`;
