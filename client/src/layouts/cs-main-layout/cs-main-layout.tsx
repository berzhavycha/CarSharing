import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { CSMainLayoutFooter } from './cs-main-layout-footer';
import { CSMainLayoutHeader } from './cs-main-layout-header';

export const CSMainLayout: FC = () => {
  return (
    <LayoutWrapper>
      <CSMainLayoutHeader />
      <MainContent>
        <Outlet />
      </MainContent>
      <CSMainLayoutFooter />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;
