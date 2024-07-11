type HookReturn = {
    preventNegativeInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const useNonNegativeInput = (): HookReturn => {
    const preventNegativeInput = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === '-' || e.key === 'e') {
            e.preventDefault();
        }
    };

    return {
        preventNegativeInput
    }
}