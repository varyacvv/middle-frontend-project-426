import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPromos } from '../api/promos'
import type { PromoBlock } from '../api/promos'
import { PromoCard } from '../components/PromoCard'

export function Home() {
    const [promos, setPromos] = useState<PromoBlock[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPromos()
            .then(setPromos)
            .catch(() => setPromos([]))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="home">
            <h1>Комплектующие для ПК с доставкой по городу</h1>
            <p className="home-lead">
                Видеокарты, процессоры и материнские платы в наличии. Собираем подборки
                под задачу, чтобы не выбирать из всего каталога сразу.
            </p>
            <Link to="/catalog" className="btn-primary">
                Перейти в каталог
            </Link>

            {!loading && promos.length > 0 && (
                <section className="home-promos">
                    <h2>Выбор магазина</h2>
                    <div className="promo-grid" data-testid="home-promo">
                        {promos.map((p) => (
                            <PromoCard key={p.id} promo={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}