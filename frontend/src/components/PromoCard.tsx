import { Link } from 'react-router-dom'
import type { PromoBlock } from '../api/promos'
import { ProductImage } from './ProductImage'

function formatPrice(amount: number): string {
    return amount.toLocaleString('ru-RU') + ' ₽'
}

export function PromoCard({ promo }: { promo: PromoBlock }) {
    const { product } = promo

    return (
        <Link
            to={`/product/${product.slug}`}
            className="promo-card"
            data-testid="home-promo-item"
        >
            <ProductImage product={product} />
            <div className="promo-body">
                <h3 className="promo-title">{promo.title}</h3>
                <p className="promo-text">{promo.text}</p>
                <div className="promo-footer">
                    <span className="promo-price">{formatPrice(product.price.amount)}</span>
                    <span className="promo-product-name">{product.name}</span>
                </div>
            </div>
        </Link>
    )
}