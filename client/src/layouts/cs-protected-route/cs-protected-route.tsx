import { FC, PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type Props = PropsWithChildren & {
  isAllowed: boolean;
  redirectPath: string;
};

export const CSProtectedRoute: FC<Props> = ({ children, isAllowed, redirectPath = '/sign-in' }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
