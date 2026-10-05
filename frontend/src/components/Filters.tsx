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
    const [prevSearch, setPrevSearch] = useState(filters.search)
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    if (filters.search !== prevSearch) {
        setPrevSearch(filters.search)
        setSearch(filters.search)
    }

    function handleSearchChange(value: string) {
        setSearch(value)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            onChange({ search: value, page: 1 })
        }, 400)
    }

    return (
        <aside className="filters" data-testid="catalog-filters">
            <h2>Фильтры</h2>

            <label>
                Категория
                <select
                    value={filters.category}
                    onChange={(e) => onChange({ category: e.target.value, page: 1 })}
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
                    value={filters.priceMin}
                    onChange={(e) => onChange({ priceMin: e.target.value, page: 1 })}
                    data-testid="filter-price-min"
                />
            </label>

            <label>
                Цена до, ₽
                <input
                    type="number"
                    placeholder="200 000"
                    value={filters.priceMax}
                    onChange={(e) => onChange({ priceMax: e.target.value, page: 1 })}
                    data-testid="filter-price-max"
                />
            </label>

            <label className="filter-checkbox">
                <input
                    type="checkbox"
                    checked={filters.available}
                    onChange={(e) => onChange({ available: e.target.checked, page: 1 })}
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