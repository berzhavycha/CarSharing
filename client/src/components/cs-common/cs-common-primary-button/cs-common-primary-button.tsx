import React from 'react';
import styled from 'styled-components';

type Props = {
  onClick?: () => Promise<void> | void;
  content: string;
  style?: 'main' | 'light';
} & AsProp;

export type AsProp<C extends React.ElementType = React.ElementType> = {
  as?: C;
};

export type PropsWithAs<P, C extends React.ElementType> = P &
  AsProp<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof (P & AsProp<C>)>;


export const CSCommonPrimaryButton = <C extends React.ElementType = 'button'>({
  as,
  onClick,
  content,
  style = 'main',
  ...rest
}: PropsWithAs<Props, C>): JSX.Element => {
  return (
    <Button as={as} onClick={onClick} $style={style} {...rest}>
      {content}
    </Button>
  );
};

type ButtonProps = {
  $style: string;
};

const Button = styled.button<ButtonProps>`
  background-color: ${(props): string => (props.$style === 'main' ? '#3563e9' : '#6b90ff')};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: var(--default-transition);
  text-decoration: none;

  &:hover {
    background-color: var(--dark-blue);
  }
`;

