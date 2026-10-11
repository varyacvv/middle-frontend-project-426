import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchOrder } from '../api/orders'
import type { Order } from '../api/orders'

function formatPrice(amount: number): string {
    return amount.toLocaleString('ru-RU') + ' ₽'
}

function formatDate(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function OrderSuccess() {
    const { id } = useParams<{ id: string }>()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const numId = Number(id)
        if (!Number.isInteger(numId) || numId <= 0) return
        fetchOrder(numId)
            .then(setOrder)
            .catch(() => setOrder(null))
            .finally(() => setLoading(false))
    }, [id])

    const numId = Number(id)
    const invalidId = !Number.isInteger(numId) || numId <= 0

    if (invalidId) {
        return (
            <div className="page">
                <p>Заказ не найден</p>
                <Link to="/catalog">Вернуться в каталог</Link>
            </div>
        )
    }

    if (loading) {
        return <div className="page">Загрузка...</div>
    }

    if (!order) {
        return (
            <div className="page">
                <p>Заказ не найден</p>
                <Link to="/catalog">Вернуться в каталог</Link>
            </div>
        )
    }

    return (
        <div className="page" data-testid="order-success">
            <div className="order-success-banner">
                <div className="order-success-icon">✓</div>
                <div>
                    <h1>Заказ №{order.id} оформлен</h1>
                    <p className="order-success-meta">
                        {formatDate(order.createdAt)} ·{' '}
                        {order.method === 'delivery'
                            ? `доставка на адрес ${order.address}`
                            : 'самовывоз'}
                    </p>
                </div>
            </div>

            <div className="order-success-layout">
                <div className="order-success-items">
                    <div className="order-success-head">
                        <h2>Состав заказа</h2>
                        <span className="badge badge-paid">Оплачен</span>
                    </div>
                    <ul>
                        {order.items.map((item) => (
                            <li key={item.productId}>
                                <span>
                                    {item.name} × {item.quantity}
                                </span>
                                <span>{formatPrice(item.price.amount * item.quantity)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <aside className="order-success-summary">
                    <div className="order-success-total-row">
                        <span>Итого</span>
                        <span data-testid="order-total">
                            {formatPrice(order.total.amount)}
                        </span>
                    </div>
                    <p className="order-success-recipient">
                        Получатель: {order.name}, {order.phone}
                    </p>
                    <Link to="/account" className="btn-primary order-success-btn">
                        Мои заказы
                    </Link>
                    <Link to="/catalog" className="order-success-link">
                        Вернуться в каталог
                    </Link>
                </aside>
            </div>
        </div>
    )
}