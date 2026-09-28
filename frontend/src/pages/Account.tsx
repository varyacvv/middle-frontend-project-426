import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function Account() {
    const { user } = useAuth()
    return (
        <div className="page">
            <h1>Личный кабинет</h1>
            <p className="lead">{user?.email}</p>
            <Link to="/catalog">Продолжить покупки</Link>
        </div>
    )
}