import { device } from '@/styles';
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
  const handleClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <Button as={as} onClick={handleClick} $style={style} {...rest}>
      {content}
    </Button>
  );
};

type ButtonProps = {
  $style: string;
};

export const Button = styled.button<ButtonProps>`
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

  @media ${device.lg} {
    font-size: 14px;
  }

  @media ${device.sm} {
    font-size: 12px;
  }
`;

