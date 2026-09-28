import { useCallback, useEffect, useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import type { User } from '../api/auth'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        authApi
            .me()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    const register = useCallback(async (email: string, password: string) => {
        const user = await authApi.register(email, password)
        setUser(user)
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        const user = await authApi.login(email, password)
        setUser(user)
    }, [])

    const logout = useCallback(async () => {
        await authApi.logout()
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}