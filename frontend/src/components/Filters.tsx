import { useRef, useState } from 'react'
import type { Category, ProductFilters } from '../api/catalog'

interface Props {
    categories: Category[]
    filters: ProductFilters
    onChange: (next: Partial<ProductFilters>) => void
    onReset: () => void
}

export function Filters({ categories, filters, onChange, onReset }: Props) {
    const [search, setSearch] = useState(filters.search)
    const [category, setCategory] = useState(filters.category)
    const [priceMin, setPriceMin] = useState(filters.priceMin)
    const [priceMax, setPriceMax] = useState(filters.priceMax)
    const [available, setAvailable] = useState(filters.available)

    const [prev, setPrev] = useState({
        search: filters.search,
        category: filters.category,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        available: filters.available,
    })

    if (
        filters.search !== prev.search ||
        filters.category !== prev.category ||
        filters.priceMin !== prev.priceMin ||
        filters.priceMax !== prev.priceMax ||
        filters.available !== prev.available
    ) {
        setPrev({
            search: filters.search,
            category: filters.category,
            priceMin: filters.priceMin,
            priceMax: filters.priceMax,
            available: filters.available,
        })
        setSearch(filters.search)
        setCategory(filters.category)
        setPriceMin(filters.priceMin)
        setPriceMax(filters.priceMax)
        setAvailable(filters.available)
    }

    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    function handleSearchChange(value: string) {
        setSearch(value)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            onChange({ search: value, page: 1 })
        }, 400)
    }

    function handleCategoryChange(value: string) {
        setCategory(value)
        onChange({ category: value, page: 1 })
    }

    function handlePriceMinChange(value: string) {
        setPriceMin(value)
        onChange({ priceMin: value, page: 1 })
    }

    function handlePriceMaxChange(value: string) {
        setPriceMax(value)
        onChange({ priceMax: value, page: 1 })
    }

    function handleAvailableChange(checked: boolean) {
        setAvailable(checked)
        onChange({ available: checked, page: 1 })
    }

    return (
        <aside className="filters" data-testid="catalog-filters">
            <h2>Фильтры</h2>

            <label>
                Категория
                <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    data-testid="filter-category"
                >
                    <option value="">Все категории</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Название
                <input
                    type="text"
                    placeholder="Например, RTX"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    data-testid="filter-search"
                />
            </label>

            <label>
                Цена от, ₽
                <input
                    type="number"
                    placeholder="0"
                    value={priceMin}
                    onChange={(e) => handlePriceMinChange(e.target.value)}
                    data-testid="filter-price-min"
                />
            </label>

            <label>
                Цена до, ₽
                <input
                    type="number"
                    placeholder="200 000"
                    value={priceMax}
                    onChange={(e) => handlePriceMaxChange(e.target.value)}
                    data-testid="filter-price-max"
                />
            </label>

            <label className="filter-checkbox">
                <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => handleAvailableChange(e.target.checked)}
                    data-testid="filter-available"
                />
                Только в наличии
            </label>

            <button
                type="button"
                className="btn-light"
                onClick={onReset}
                data-testid="filter-reset"
            >
                Сбросить фильтры
            </button>
        </aside>
    )
}