import { useState } from 'react';

import { Roles } from '@/helpers';

type HookReturn = {
  userRole: string;
  showSecretCodeInput: boolean;
  handleUserTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const useUserRole = (): HookReturn => {
  const [userRole, setUserRole] = useState<string>(Roles.USER);
  const [showSecretCodeInput, setShowSecretCodeInput] = useState<boolean>(false);

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedRole = event.target.value;
    setUserRole(selectedRole);
    setShowSecretCodeInput(selectedRole === Roles.ADMIN);
  };

  return {
    userRole,
    showSecretCodeInput,
    handleUserTypeChange,
  };
};
