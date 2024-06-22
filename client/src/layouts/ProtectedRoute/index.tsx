import { Navigate, Outlet } from 'react-router-dom';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
    isAllowed: boolean;
    redirectPath: string;
}

export const ProtectedRoute: FC<Props> = ({ children, isAllowed, redirectPath = '/sign-in' }) => {
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
};

