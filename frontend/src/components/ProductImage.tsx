import type { Product } from '../api/catalog'

export function ProductImage({ product }: { product: Product }) {
    return (
        <div className={`product-image product-image-${product.category.slug}`}>
            {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
            ) : (
                <>
                    <div className="product-chip">
                        <div className="product-chip-inner">{product.name}</div>
                    </div>
                    <small className="product-chip-category">{product.category.name}</small>
                </>
            )}
        </div>
    )
}