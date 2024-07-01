import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { CSMainLayoutHeader } from './cs-main-layout-header';
import { CSMainLayoutFooter } from './cs-main-layout-footer';

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