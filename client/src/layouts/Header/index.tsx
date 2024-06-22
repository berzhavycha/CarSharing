import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '@/components';

import { CarSearch, HeaderOptions } from './components';

export const Header: FC = () => {
  return (
    <>
      <Section>
        <Container>
          <Nav>
            <LeftSection>
              <Logo>CARRENT</Logo>
              <CarSearch />
            </LeftSection>
            <HeaderOptions />
          </Nav>
        </Container>
      </Section>
      <Outlet />
    </>
  );
};

const Section = styled.div`
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const LeftSection = styled.div`
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: var(--main-blue);
`;
