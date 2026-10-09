import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProduct } from '../api/catalog'
import type { Product } from '../api/catalog'
import { ProductImage } from '../components/ProductImage'
import { useCart } from '../context/useCart'

interface CartLine {
    slug: string
    quantity: number
    product: Product | null
}

function formatPrice(amount: number): string {
    return amount.toLocaleString('ru-RU') + ' ₽'
}

export function Cart() {
    const { items, setQuantity, remove } = useCart()
    const [lines, setLines] = useState<CartLine[]>([])
    const [loading, setLoading] = useState(true)

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
            if (!cancelled) {
                setLines(result)
                setLoading(false)
            }
        })

        return () => {
            cancelled = true
        }
    }, [items])

    const total = lines.reduce((sum, line) => {
        if (!line.product || !line.product.inStock) return sum
        return sum + line.product.price.amount * line.quantity
    }, 0)

    const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)

    if (loading) {
        return <div className="page">Загрузка...</div>
    }

    if (items.length === 0) {
        return (
            <div className="page">
                <h1>Корзина</h1>
                <div className="cart-empty" data-testid="cart-empty">
                    <p>Ваша корзина пуста.</p>
                    <Link to="/catalog" className="btn-primary">
                        Перейти в каталог
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            <h1>Корзина</h1>

            <div className="cart-layout">
                <div className="cart-items">
                    {lines.map((line) => (
                        <div className="cart-item" key={line.slug} data-testid="cart-item">
                            <div className="cart-item-image">
                                {line.product ? (
                                    <ProductImage product={line.product} />
                                ) : (
                                    <div className="cart-item-missing">Нет в каталоге</div>
                                )}
                            </div>

                            <div className="cart-item-info">
                                {line.product ? (
                                    <>
                                        <Link
                                            to={`/product/${line.product.slug}`}
                                            className="cart-item-name"
                                        >
                                            {line.product.name}
                                        </Link>
                                        <p className="cart-item-price">
                                            {formatPrice(line.product.price.amount)} за штуку
                                        </p>
                                        {!line.product.inStock && (
                                            <span className="badge badge-out-of-stock">Нет в наличии</span>
                                        )}
                                    </>
                                ) : (
                                    <p className="cart-item-name cart-item-name-broken">
                                        Товар больше не продаётся
                                    </p>
                                )}
                            </div>

                            <input
                                type="number"
                                min={1}
                                value={line.quantity}
                                onChange={(e) => {
                                    const value = Number(e.target.value)
                                    if (value >= 1) setQuantity(line.slug, value)
                                }}
                                className="cart-item-qty"
                                data-testid="cart-item-qty"
                            />

                            <span className="cart-item-sum">
                                {line.product && line.product.inStock
                                    ? formatPrice(line.product.price.amount * line.quantity)
                                    : '—'}
                            </span>

                            <button
                                type="button"
                                className="cart-item-remove"
                                onClick={() => remove(line.slug)}
                                data-testid="cart-item-remove"
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                </div>

                <aside className="cart-summary">
                    <h2>Итог</h2>
                    <div className="cart-summary-row">
                        <span>Товаров</span>
                        <span>{totalCount}</span>
                    </div>
                    <div className="cart-summary-row cart-summary-total">
                        <span>К оплате</span>
                        <span data-testid="cart-total">{formatPrice(total)}</span>
                    </div>
                    <Link
                        to="/checkout"
                        className="btn-primary cart-checkout"
                        data-testid="cart-checkout"
                    >
                        Оформить заказ
                    </Link>
                    <p className="cart-summary-note">
                        Окончательную сумму посчитает сервер по актуальным ценам.
                    </p>
                </aside>
            </div>
        </div>
    )
}