import { Link } from 'react-router-dom'

export function Footer() {
    return (
        <footer className="footer">
            <span>Магазин комплектующих для ПК — учебный проект Хекслета</span>
            <Link to="/catalog">Каталог</Link>
        </footer>
    )
}