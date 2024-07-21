import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonSpinner } from '@/components';
import { Roles } from '@/helpers';
import { AuthenticatedUser } from '@/types';

type Props = PropsWithChildren & {
  isAllowed: () => Promise<{ allowed: boolean; user: AuthenticatedUser | null }>;
  redirectPath?: string;
  errorMessage?: string;
};

export const CSProtectedRoute: FC<Props> = ({
  children,
  isAllowed,
  errorMessage,
  redirectPath = '/sign-in',
}) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermission = async (): Promise<void> => {
      const { allowed, user } = await isAllowed();

      if (user?.role === Roles.ADMIN) {
        navigate('/dashboard/profile-settings');
      }

      setAllowed(allowed);
    };

    checkPermission();
  }, [isAllowed]);

  if (allowed === null) {
    return (
      <SpinnerContainer>
        <CSCommonSpinner />
      </SpinnerContainer>
    );
  }

  if (!allowed) {
    return <Navigate to={redirectPath} replace state={{ errorMessage, from: location.pathname }} />;
  }

  return children ? children : <Outlet />;
};

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: white;
`;
