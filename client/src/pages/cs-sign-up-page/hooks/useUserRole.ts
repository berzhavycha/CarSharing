import { Roles } from "@/helpers";
import { useState } from "react";

type HookReturn = {
    userRole: string;
    showSecretCodeInput: boolean;
    handleUserTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const useUserRole = (): HookReturn => {
    const [userRole, setUserRole] = useState<string>('user');
    const [showSecretCodeInput, setShowSecretCodeInput] = useState<boolean>(false);

    const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const selectedRole = event.target.value;
        setUserRole(selectedRole);
        setShowSecretCodeInput(selectedRole === Roles.ADMIN);
    };

    return {
        userRole,
        showSecretCodeInput,
        handleUserTypeChange
    }
}