import { Link } from 'react-router-dom'
import type { Product } from '../api/catalog'

function formatPrice(amount: number): string {
    return amount.toLocaleString('ru-RU') + ' ₽'
}

export function ProductCard({ product }: { product: Product }) {
    return (
        <div className="product-card">
            <div className="product-image">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                ) : (
                    <div className="product-image-placeholder">
                        <span>{product.name}</span>
                        <small>{product.category.name}</small>
                    </div>
                )}
            </div>
            <div className="product-body">
                <Link to={`/product/${product.slug}`} className="product-name">
                    {product.name}
                </Link>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                    <span className="product-price">{formatPrice(product.price.amount)}</span>
                    <span className={product.inStock ? 'badge badge-in-stock' : 'badge badge-out-of-stock'}>
                        {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                </div>
            </div>
        </div>
    )
}