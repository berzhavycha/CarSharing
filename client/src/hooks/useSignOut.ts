import { useNavigate } from 'react-router-dom';

import { useStore } from '@/context';

type HookReturn = {
  onSignOut: () => Promise<void>;
};

export const useSignOut = (): HookReturn => {
  const {
    currentUserStore: { signOut },
  } = useStore();

  const navigate = useNavigate();

  const onSignOut = async (): Promise<void> => {
    await signOut();
    navigate('/');
  };

  return {
    onSignOut,
  };
};
