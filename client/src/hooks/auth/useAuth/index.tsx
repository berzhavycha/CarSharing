import { Env } from "@/core";
import { UNEXPECTED_ERROR_MESSAGE, pickUserErrorMessages, transformUserResponse } from "@/helpers";
import { User, UserDto } from "@/types";
import axios, { AxiosError } from "axios";

type AuthResponse = {
    user: User | null;
    errors: { [key: string]: string };
}

type HookReturn = {
    auth: (userDto: UserDto) => Promise<AuthResponse>
}

export const useAuth = (): HookReturn => {
    const auth = async (userDto: UserDto): Promise<AuthResponse> => {
        try {
            const { data } = await axios.post(`${Env.API_BASE_URL}/auth/sign-up`, userDto);

            return {
                user: transformUserResponse(data),
                errors: {}
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    user: null,
                    errors: pickUserErrorMessages([error.response?.data.message])
                }
            }

            return {
                user: null,
                errors: { unexpected: UNEXPECTED_ERROR_MESSAGE }
            }
        }
    }

    return {
        auth
    }
}