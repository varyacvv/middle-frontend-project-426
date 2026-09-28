import { Link } from 'react-router-dom'

export function Home() {
    return (
        <div className="page">
            <h1>Комплектующие для ПК с доставкой по городу</h1>
            <p className="lead">
                Видеокарты, процессоры и материнские платы в наличии.
            </p>
            <Link to="/catalog" className="btn-primary">
                Перейти в каталог
            </Link>
        </div>
    )
}