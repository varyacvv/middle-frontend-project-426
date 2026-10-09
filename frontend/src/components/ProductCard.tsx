import { Link } from 'react-router-dom'
import type { Product } from '../api/catalog'
import { ProductImage } from './ProductImage'
import { useCart } from '../context/useCart'

function formatPrice(amount: number): string {
    return amount.toLocaleString('ru-RU') + ' ₽'
}

export function ProductCard({ product }: { product: Product }) {
    const { add } = useCart()

    return (
        <div className="product-card" data-testid="catalog-item">
            <ProductImage product={product} />
            <div className="product-body">
                <Link
                    to={`/product/${product.slug}`}
                    className="product-name"
                    data-testid="catalog-item-name"
                >
                    {product.name}
                </Link>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                    <span className="product-price" data-testid="catalog-item-price">
                        {formatPrice(product.price.amount)}
                    </span>
                    <span
                        className={
                            product.inStock ? 'badge badge-in-stock' : 'badge badge-out-of-stock'
                        }
                        data-testid="catalog-item-availability"
                        data-available={product.inStock ? 'true' : 'false'}
                    >
                        {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                </div>
                <button
                    type="button"
                    className="product-card-add"
                    onClick={() => add(product.slug)}
                    disabled={!product.inStock}
                >
                    {product.inStock ? 'В корзину' : 'Нет в наличии'}
                </button>
            </div>
        </div>
    )
}