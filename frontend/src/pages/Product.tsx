import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct } from '../api/catalog'
import type { Product as ProductType } from '../api/catalog'
import { ProductImage } from '../components/ProductImage'
import { useCart } from '../context/useCart'

function formatPrice(amount: number): string {
    return amount.toLocaleString('ru-RU') + ' ₽'
}

export function Product() {
    const { slug } = useParams<{ slug: string }>()
    const { add } = useCart()
    const [product, setProduct] = useState<ProductType | null>(null)
    const [loading, setLoading] = useState(true)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        if (!slug) return
        fetchProduct(slug)
            .then(setProduct)
            .catch(() => setProduct(null))
            .finally(() => setLoading(false))
    }, [slug])

    if (loading) {
        return <div className="page">Загрузка...</div>
    }

    if (!product) {
        return (
            <div className="page">
                <p>Товар не найден</p>
                <Link to="/catalog">Вернуться в каталог</Link>
            </div>
        )
    }

    function handleAdd() {
        if (!product || !product.inStock) return
        add(product.slug)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className="page">
            <nav className="breadcrumbs">
                <Link to="/catalog">Каталог</Link>
                <span> → </span>
                <span>{product.name}</span>
            </nav>

            <div className="product-detail">
                <ProductImage product={product} />

                <div className="product-detail-info">
                    <h1 data-testid="product-name">{product.name}</h1>

                    <span
                        className={
                            product.inStock ? 'badge badge-in-stock' : 'badge badge-out-of-stock'
                        }
                    >
                        {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>

                    <p className="product-detail-description" data-testid="product-description">
                        {product.description}
                    </p>

                    <div className="product-detail-buy">
                        <span className="product-detail-price" data-testid="product-price">
                            {formatPrice(product.price.amount)}
                        </span>

                        <button
                            type="button"
                            className="btn-primary product-add-btn"
                            onClick={handleAdd}
                            disabled={!product.inStock}
                            data-testid="product-add-to-cart"
                        >
                            {added ? 'Добавлено' : 'В корзину'}
                        </button>
                    </div>

                    <ul className="product-detail-notes">
                        <li>Цена указана в рублях, без копеек</li>
                        <li>Доставка по городу или самовывоз</li>
                        <li>Оплата при оформлении заказа</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}