import { useEffect, useState } from 'react'
import { fetchCategories, fetchProducts } from '../api/catalog'
import type { Category, Product, ProductFilters } from '../api/catalog'
import { Filters } from '../components/Filters'
import { ProductCard } from '../components/ProductCard'
import { Pagination } from '../components/Pagination'

const EMPTY_FILTERS: ProductFilters = {
    category: '',
    priceMin: '',
    priceMax: '',
    available: false,
    search: '',
    page: 1,
}

export function Catalog() {
    const [categories, setCategories] = useState<Category[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(12)
    const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCategories().then(setCategories).catch(() => setCategories([]))
    }, [])

    useEffect(() => {
        fetchProducts(filters)
            .then((data) => {
                setProducts(data.items)
                setTotal(data.total)
                setPageSize(data.pageSize)
            })
            .catch(() => {
                setProducts([])
                setTotal(0)
            })
            .finally(() => setLoading(false))
    }, [filters])

    function updateFilters(next: Partial<ProductFilters>) {
        setFilters((prev) => ({ ...prev, ...next }))
    }

    function resetFilters() {
        setFilters(EMPTY_FILTERS)
    }

    return (
        <div className="catalog">
            <Filters
                categories={categories}
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
            />
            <section className="catalog-main">
                <h1>Комплектующие для ПК</h1>
                <p className="catalog-count">
                    {loading ? 'Загрузка...' : `Найдено товаров: ${total}`}
                </p>
                <div className="product-grid">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
                <Pagination
                    page={filters.page}
                    pageSize={pageSize}
                    total={total}
                    onChange={(page) => updateFilters({ page })}
                />
            </section>
        </div>
    )
}