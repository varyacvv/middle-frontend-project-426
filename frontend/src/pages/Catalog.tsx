import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCategories, fetchProducts } from '../api/catalog'
import type { Category, Product, ProductFilters } from '../api/catalog'
import { Filters } from '../components/Filters'
import { ProductCard } from '../components/ProductCard'
import { Pagination } from '../components/Pagination'

function readFilters(params: URLSearchParams): ProductFilters {
    const page = Number(params.get('page'))
    return {
        category: params.get('category') ?? '',
        priceMin: params.get('priceMin') ?? '',
        priceMax: params.get('priceMax') ?? '',
        available: params.get('available') === 'true',
        search: params.get('search') ?? '',
        page: Number.isInteger(page) && page > 0 ? page : 1,
    }
}

function writeFilters(filters: ProductFilters): URLSearchParams {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.priceMin) params.set('priceMin', filters.priceMin)
    if (filters.priceMax) params.set('priceMax', filters.priceMax)
    if (filters.available) params.set('available', 'true')
    if (filters.search) params.set('search', filters.search)
    if (filters.page > 1) params.set('page', String(filters.page))
    return params
}

export function Catalog() {
    const [searchParams, setSearchParams] = useSearchParams()
    const filters = readFilters(searchParams)

    const [categories, setCategories] = useState<Category[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [total, setTotal] = useState(0)
    const [pageSize, setPageSize] = useState(12)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    function updateFilters(next: Partial<ProductFilters>) {
        const updated = { ...filters, ...next }
        setSearchParams(writeFilters(updated))
    }

    function resetFilters() {
        setSearchParams(new URLSearchParams())
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
                {!loading && products.length === 0 ? (
                    <div className="catalog-empty">
                        <h2>Ничего не найдено</h2>
                        <p>Измените параметры поиска или сбросьте фильтры</p>
                        <button type="button" className="btn-primary" onClick={resetFilters}>
                            Показать все товары
                        </button>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}
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