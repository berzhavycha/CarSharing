import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { CSMainLayoutHeader } from './cs-main-layout-header';
import { CSMainLayoutFooter } from './cs-main-layout-footer';


export const CSMainLayout: FC = () => {
    return (
        <>
            <CSMainLayoutHeader />
            <Outlet />
            <CSMainLayoutFooter />
        </>
    );
};
