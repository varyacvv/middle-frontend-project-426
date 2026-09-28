import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { ApiError } from '../api/auth'

export function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit() {
        setError('')
        setSubmitting(true)
        try {
            await login(email, password)
            navigate('/')
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError('Что-то пошло не так')
            }
        }
        setSubmitting(false)
    }

    return (
        <div className="auth-card">
            <h1>Вход</h1>
            <p>Войдите, чтобы оформить заказ и видеть историю покупок.</p>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit()
                }}
            >
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        data-testid="auth-email"
                        required
                    />
                </label>
                <label>
                    Пароль
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        data-testid="auth-password"
                        required
                    />
                </label>
                <button type="submit" disabled={submitting} data-testid="auth-submit">
                    Войти
                </button>
                {error && (
                    <div className="error" data-testid="auth-error">
                        {error}
                    </div>
                )}
            </form>
            <p>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    )
}