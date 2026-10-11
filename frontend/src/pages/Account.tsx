import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../api/orders'
import type { Order } from '../api/orders'
import { useAuth } from '../context/useAuth'

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

export function Account() {
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [openIds, setOpenIds] = useState<number[]>([])

    useEffect(() => {
        fetchOrders()
            .then((data) => {
                setOrders(data)
                // Раскрываем все заказы сразу — состав виден без клика,
                // поэтому переключатель не нужен.
                setOpenIds(data.map((o) => o.id))
            })
            .catch(() => setOrders([]))
            .finally(() => setLoading(false))
    }, [])

    function toggle(id: number) {
        setOpenIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        )
    }

    return (
        <div className="page">
            <h1>Личный кабинет</h1>
            <p className="account-email">{user?.email}</p>

            {loading ? (
                <p>Загрузка...</p>
            ) : orders.length === 0 ? (
                <div className="account-orders-empty" data-testid="account-orders-empty">
                    <p>Заказов пока нет.</p>
                    <Link to="/catalog" className="btn-primary">
                        Перейти в каталог
                    </Link>
                </div>
            ) : (
                <div className="account-orders" data-testid="account-orders">
                    {orders.map((order) => {
                        const isOpen = openIds.includes(order.id)
                        return (
                            <div
                                key={order.id}
                                className="account-order"
                                data-testid="account-order-item"
                            >
                                <div className="account-order-head">
                                    <div className="account-order-head-left">
                                        <strong>Заказ №{order.id}</strong>
                                        <span
                                            className="badge badge-paid"
                                            data-testid="order-status"
                                            data-status={order.status}
                                        >
                                            {order.status === 'paid' ? 'Оплачен' : order.status}
                                        </span>
                                    </div>
                                    <div className="account-order-head-right">
                                        <span className="account-order-date">
                                            {formatDate(order.createdAt)}
                                        </span>
                                        <button
                                            type="button"
                                            className="account-order-toggle"
                                            onClick={() => toggle(order.id)}
                                            data-testid="account-order-toggle"
                                        >
                                            {isOpen ? 'Свернуть' : 'Показать состав'}
                                        </button>
                                    </div>
                                </div>

                                {isOpen && (
                                    <>
                                        <div className="account-order-table-head">
                                            <span>Товар</span>
                                            <span>Кол-во</span>
                                            <span>Цена покупки</span>
                                            <span>Сумма</span>
                                        </div>
                                        <div className="account-order-lines">
                                            {order.items.map((item) => (
                                                <div
                                                    key={item.productId}
                                                    className="account-order-line"
                                                    data-testid="account-order-line"
                                                >
                                                    <span className="account-order-line-name">
                                                        {item.name}
                                                    </span>
                                                    <span data-testid="account-order-line-qty">
                                                        {item.quantity}
                                                    </span>
                                                    <span data-testid="account-order-line-price">
                                                        {formatPrice(item.price.amount)}
                                                    </span>
                                                    <span className="account-order-line-sum">
                                                        {formatPrice(item.price.amount * item.quantity)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="account-order-footer">
                                            <span className="account-order-delivery">
                                                {order.method === 'delivery'
                                                    ? `Доставка: ${order.address} · ${order.name}, ${order.phone}`
                                                    : `Самовывоз · ${order.name}, ${order.phone}`}
                                            </span>
                                            <span className="account-order-total">
                                                Итого:{' '}
                                                <span data-testid="order-total">
                                                    {formatPrice(order.total.amount)}
                                                </span>
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <p className="account-back">
                <Link to="/catalog">Продолжить покупки</Link>
            </p>
        </div>
    )
}