import { useEffect, useState } from 'react'
import type { Category, ProductFilters } from '../api/catalog'

interface Props {
  categories: Category[]
  filters: ProductFilters
  onChange: (next: Partial<ProductFilters>) => void
  onReset: () => void
}

export function Filters({ categories, filters, onChange, onReset }: Props) {
  const [search, setSearch] = useState(filters.search)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(filters.search)
  }, [filters.search])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filters.search) {
        onChange({ search, page: 1 })
      }
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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