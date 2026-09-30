import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function RequireAuth({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <p style={{ padding: 30 }}>Загрузка...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}