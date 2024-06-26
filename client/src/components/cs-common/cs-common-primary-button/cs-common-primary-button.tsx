import { FC } from 'react';
import styled from 'styled-components';

type Props = {
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => Promise<void> | void;
    content: string;
};

export const CSCommonPrimaryButton: FC<Props> = ({ type, onClick, content }) => {
    return (
        <Button type={type} onClick={onClick}>
            {content}
        </Button>
    );
};

const Button = styled.button`
  background-color: var(--main-blue);
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
