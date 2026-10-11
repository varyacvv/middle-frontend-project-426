import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchProduct } from '../api/catalog'
import type { Product } from '../api/catalog'
import { createOrder, OrderError } from '../api/orders'
import type { UnavailableItem } from '../api/orders'
import { useCart } from '../context/useCart'

function formatPrice(amount: number): string {
    return amount.toLocaleString('ru-RU') + ' ₽'
}

interface Line {
    slug: string
    quantity: number
    product: Product | null
}

export function Checkout() {
    const { items, clear } = useCart()
    const navigate = useNavigate()

    const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [error, setError] = useState('')
    const [unavailable, setUnavailable] = useState<UnavailableItem[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [lines, setLines] = useState<Line[]>([])

    useEffect(() => {
        let cancelled = false
        Promise.all(
            items.map(async (item) => {
                try {
                    const product = await fetchProduct(item.slug)
                    return { ...item, product }
                } catch {
                    return { ...item, product: null }
                }
            })
        ).then((result) => {
            if (!cancelled) setLines(result)
        })
        return () => {
            cancelled = true
        }
    }, [items])

    const previewTotal = lines.reduce((sum, line) => {
        if (!line.product) return sum
        return sum + line.product.price.amount * line.quantity
    }, 0)

    if (items.length === 0) {
        return (
            <div className="page">
                <h1>Оформление заказа</h1>
                <div className="cart-empty" data-testid="cart-empty">
                    <p>Корзина пуста — оформлять нечего.</p>
                    <Link to="/catalog" className="btn-primary">
                        Перейти в каталог
                    </Link>
                </div>
            </div>
        )
    }

    async function handleSubmit() {
        setError('')
        setUnavailable([])
        setSubmitting(true)
        try {
            const order = await createOrder({
                method,
                name,
                phone,
                address: method === 'delivery' ? address : undefined,
                items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
            })
            clear()
            navigate(`/order-success/${order.id}`)
        } catch (err) {
            if (err instanceof OrderError) {
                setError(err.message)
                setUnavailable(err.unavailable)
            } else {
                setError('Что-то пошло не так')
            }
        }
        setSubmitting(false)
    }

    return (
        <div className="page">
            <h1>Оформление заказа</h1>

            <div className="checkout-layout">
                <form
                    className="checkout-form"
                    data-testid="checkout-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                >
                    <h2>Получение</h2>

                    <label>
                        Способ получения
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value as 'delivery' | 'pickup')}
                            data-testid="checkout-method"
                        >
                            <option value="delivery">Доставка</option>
                            <option value="pickup">Самовывоз</option>
                        </select>
                    </label>

                    <label>
                        Имя получателя
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            data-testid="checkout-name"
                        />
                    </label>

                    <label>
                        Телефон
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            data-testid="checkout-phone"
                        />
                    </label>

                    {method === 'delivery' && (
                        <label>
                            Адрес доставки
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                data-testid="checkout-address"
                            />
                        </label>
                    )}

                    <button
                        type="submit"
                        className="btn-primary checkout-submit"
                        disabled={submitting}
                        data-testid="checkout-submit"
                    >
                        Оформить заказ
                    </button>

                    {error && (
                        <div className="error" data-testid="order-error">
                            {error}
                        </div>
                    )}

                    {unavailable.length > 0 && (
                        <ul className="checkout-unavailable">
                            {unavailable.map((item) => (
                                <li key={item.slug}>
                                    {item.slug} —{' '}
                                    {item.reason === 'not_found' ? 'не найден' : 'нет в наличии'}
                                </li>
                            ))}
                        </ul>
                    )}
                </form>

                <aside className="checkout-summary">
                    <h2>Состав заказа</h2>
                    <ul className="checkout-summary-list">
                        {lines.map((line) => (
                            <li key={line.slug}>
                                <span>
                                    {line.product ? line.product.name : line.slug} × {line.quantity}
                                </span>
                                <span>
                                    {line.product
                                        ? formatPrice(line.product.price.amount * line.quantity)
                                        : '—'}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="checkout-summary-total">
                        <span>Предварительный итог</span>
                        <span>{formatPrice(previewTotal)}</span>
                    </div>
                    <p className="checkout-summary-note">
                        Окончательную сумму посчитает сервер по актуальным ценам товаров.
                    </p>
                </aside>
            </div>
        </div>
    )
}