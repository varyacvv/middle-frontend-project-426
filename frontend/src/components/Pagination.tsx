interface Props {
    page: number
    pageSize: number
    total: number
    onChange: (page: number) => void
}

export function Pagination({ page, pageSize, total, onChange }: Props) {
    const totalPages = Math.ceil(total / pageSize)
    if (totalPages <= 1) return null

    const pages: number[] = []
    for (let i = 1; i <= totalPages; i++) pages.push(i)

    return (
        <div className="pagination" data-testid="catalog-pagination">
            <button
                type="button"
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                data-testid="catalog-page-prev"
            >
                ‹
            </button>
            {pages.map((n) => (
                <button
                    type="button"
                    key={n}
                    className={n === page ? 'page-active' : ''}
                    onClick={() => onChange(n)}
                >
                    {n}
                </button>
            ))}
            <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
                data-testid="catalog-page-next"
            >
                ›
            </button>
        </div>
    )
}