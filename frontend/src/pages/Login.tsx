import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useAuth } from '../context/useAuth'
import { errorMessage } from '../api/auth'

const schema = yup.object({
    email: yup
        .string()
        .required('Введите email')
        .email('Некорректный email'),
    password: yup.string().required('Введите пароль'),
})

interface FieldErrors {
    email?: string
    password?: string
}

export function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit() {
        setError('')
        setFieldErrors({})

        try {
            await schema.validate({ email, password }, { abortEarly: false })
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const errors: FieldErrors = {}
                for (const issue of err.inner) {
                    if (issue.path === 'email') errors.email = issue.message
                    if (issue.path === 'password') errors.password = issue.message
                }
                setFieldErrors(errors)
                return
            }
            throw err
        }

        setSubmitting(true)
        try {
            await login(email, password)
            navigate('/')
        } catch (err) {
            setError(errorMessage(err))
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
                    />
                    {fieldErrors.email && (
                        <span className="field-error">{fieldErrors.email}</span>
                    )}
                </label>
                <label>
                    Пароль
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        data-testid="auth-password"
                    />
                    {fieldErrors.password && (
                        <span className="field-error">{fieldErrors.password}</span>
                    )}
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