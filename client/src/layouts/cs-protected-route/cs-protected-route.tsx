import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type Props = PropsWithChildren & {
  isAllowed: () => Promise<boolean>;
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

  useEffect(() => {
    const checkPermission = async (): Promise<void> => {
      const result = await isAllowed();
      setAllowed(result);
    };

    checkPermission();
  }, [isAllowed]);

  if (allowed === null) {
    return <div>Loading...</div>;
  }

  if (!allowed) {
    return <Navigate to={redirectPath} replace state={{ errorMessage }} />;
  }

  return children ? children : <Outlet />;
};
