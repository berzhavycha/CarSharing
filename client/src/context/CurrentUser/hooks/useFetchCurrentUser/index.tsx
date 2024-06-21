import { Env } from "@/core"
import { transformUserResponse } from "@/helpers"
import { User } from "@/types"
import axios from "axios"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

type HookReturn = {
    user: User | null,
    setUser: Dispatch<SetStateAction<User | null>>
}

export const useFetchCurrentUser = (): HookReturn => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            try {
                const { data } = await axios.get(`${Env.API_BASE_URL}/auth/current-user`);
                setUser(transformUserResponse(data))
            } catch (error) {
                setUser(null)
                console.log(error)
            }
        }

        fetchUser()
    }, [])

    return {
        user,
        setUser
    }
}