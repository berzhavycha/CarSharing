import { axiosInstance } from "@/api"
import { Env } from "@/core"
import { UNEXPECTED_ERROR_MESSAGE } from "@/helpers"
import { useState } from "react"

type HookReturn = {
    onSignOut: () => Promise<void>;
    error: string;
}

export const useSignOut = (): HookReturn => {
    const [error, setError] = useState<string>('')

    const onSignOut = async (): Promise<void> => {
        try {
            await axiosInstance.post(`${Env.API_BASE_URL}/auth/sign-out`);
        } catch (error) {
            setError(UNEXPECTED_ERROR_MESSAGE)
        }
    }

    return {
        error,
        onSignOut
    }
}