import type { Category, ProductFilters } from '../api/catalog'

interface Props {
    categories: Category[]
    filters: ProductFilters
    onChange: (next: Partial<ProductFilters>) => void
    onReset: () => void
}

export function Filters({ categories, filters, onChange, onReset }: Props) {
    return (
        <aside className="filters">
            <h2>Фильтры</h2>

            <label>
                Категория
                <select
                    value={filters.category}
                    onChange={(e) => onChange({ category: e.target.value, page: 1 })}
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
                    value={filters.search}
                    onChange={(e) => onChange({ search: e.target.value, page: 1 })}
                />
            </label>

            <label>
                Цена от, ₽
                <input
                    type="number"
                    placeholder="0"
                    value={filters.priceMin}
                    onChange={(e) => onChange({ priceMin: e.target.value, page: 1 })}
                />
            </label>

            <label>
                Цена до, ₽
                <input
                    type="number"
                    placeholder="200 000"
                    value={filters.priceMax}
                    onChange={(e) => onChange({ priceMax: e.target.value, page: 1 })}
                />
            </label>

            <label className="filter-checkbox">
                <input
                    type="checkbox"
                    checked={filters.available}
                    onChange={(e) => onChange({ available: e.target.checked, page: 1 })}
                />
                Только в наличии
            </label>

            <button type="button" className="btn-light" onClick={onReset}>
                Сбросить фильтры
            </button>
        </aside>
    )
}