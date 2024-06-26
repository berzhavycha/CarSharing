import { FC } from 'react';
import styled from 'styled-components';

type Props = {
    icon: JSX.Element;
    text: string;
};

export const CarFeature: FC<Props> = ({ icon, text }) => {
    return (
        <Feature>
            {icon}
            <span>{text}</span>
        </Feature>
    );
};

const Feature = styled.div`
  display: flex;
  align-items: center;
  color: var(--gray);
  font-size: 14px;

  svg {
    margin-right: 7px;
    font-size: 18px;
  }
`;
