import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { errorMessage } from '../api/auth'

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    setError('')
    setSubmitting(true)
    try {
      await register(email, password)
      navigate('/')
    } catch (err) {
      setError(errorMessage(err))
    }
    setSubmitting(false)
  }

  return (
    <div className="auth-card">
      <h1>Регистрация</h1>
      <p>Аккаунт нужен, чтобы оформить заказ и видеть историю покупок.</p>
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
          Зарегистрироваться
        </button>
        {error && (
          <div className="error" data-testid="auth-error">
            {error}
          </div>
        )}
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  )
}