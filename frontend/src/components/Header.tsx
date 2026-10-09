import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useCart } from '../context/useCart'

export function Header() {
    const { user, logout } = useAuth()
    const { totalCount } = useCart()
    const navigate = useNavigate()

    async function handleLogout() {
        await logout()
        navigate('/')
    }

    return (
        <header className="header">
            <Link to="/" className="logo">
                <span className="logo-mark" />
                Комплектующие
            </Link>
            <nav className="header-nav">
                <Link to="/catalog" data-testid="nav-catalog">
                    Каталог
                </Link>
                <Link to="/cart" className="nav-cart" data-testid="nav-cart">
                    Корзина
                    {totalCount > 0 && <span className="nav-cart-count">{totalCount}</span>}
                </Link>
                {user ? (
                    <>
                        <Link to="/account" data-testid="nav-account">
                            Кабинет
                        </Link>
                        <button
                            type="button"
                            className="btn-light"
                            onClick={handleLogout}
                            data-testid="nav-signout"
                        >
                            Выйти
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" data-testid="nav-signin">
                            Вход
                        </Link>
                        <Link to="/register" className="btn-primary" data-testid="nav-signup">
                            Регистрация
                        </Link>
                    </>
                )}
            </nav>
        </header>
    )
}