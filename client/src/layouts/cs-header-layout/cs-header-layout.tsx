import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonContainer } from '@/components';

import { CSHeaderLayoutCarSearch } from './cs-header-layout-car-search';
import { CSHeaderLayoutOptions } from './cs-header-layout-options';

export const CSHeaderLayout: FC = () => {
  return (
    <>
      <Section>
        <CSCommonContainer>
          <Nav>
            <LeftSection>
              <Logo>CARRENT</Logo>
              <CSHeaderLayoutCarSearch />
            </LeftSection>
            <CSHeaderLayoutOptions />
          </Nav>
        </CSCommonContainer>
      </Section>
      <Outlet />
    </>
  );
};

const Section = styled.div`
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 50px;
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
