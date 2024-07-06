import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonContainer } from '@/components';

import { CSHeaderLayoutCarSearch } from './cs-header-layout-car-search';
import { CSHeaderLayoutOptions } from './cs-header-layout-options';
import { device } from '@/styles';

export const CSMainLayoutHeader: FC = () => {
  const { pathname } = useLocation();
  const isSearchBarEnabled = ['/', '/available-cars'].includes(pathname);

  return (
    <Section>
      <CSCommonContainer>
        <HeaderContent>
          <Logo to="/">CARRENT</Logo>
          <Nav>
            {isSearchBarEnabled && <CSHeaderLayoutCarSearch />}
            <CSHeaderLayoutOptions />
          </Nav>
        </HeaderContent>
      </CSCommonContainer>
    </Section>
  );
};

const Section = styled.div`
  padding: 20px 5px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 60px;

  @media ${device.sm} {
    justify-content: space-between;
  }
`;

export const Logo = styled(Link)`
  font-size: 32px;
  font-weight: bold;
  color: var(--main-blue);
  cursor: pointer;
  text-decoration: none;

  @media ${device.lg} {
    font-size: 28px;
  }

  @media ${device.md} {
    font-size: 24px;
  }

  @media ${device.sm} {
    font-size: 20px;
  }

  @media (max-width: 600px) {
    align-self: center;
  }
`;