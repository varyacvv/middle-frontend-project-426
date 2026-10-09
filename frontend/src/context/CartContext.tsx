import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { CartContext, type CartItem } from './cart-context'

const STORAGE_KEY = 'cart'

function loadCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []
        return parsed
    } catch {
        return []
    }
}

function saveCart(items: CartItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(loadCart)

    useEffect(() => {
        saveCart(items)
    }, [items])

    const add = useCallback((slug: string) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.slug === slug)
            if (existing) {
                return prev.map((i) =>
                    i.slug === slug ? { ...i, quantity: i.quantity + 1 } : i
                )
            }
            return [...prev, { slug, quantity: 1 }]
        })
    }, [])

    const remove = useCallback((slug: string) => {
        setItems((prev) => prev.filter((i) => i.slug !== slug))
    }, [])

    const setQuantity = useCallback((slug: string, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((i) => i.slug !== slug))
            return
        }
        setItems((prev) =>
            prev.map((i) => (i.slug === slug ? { ...i, quantity } : i))
        )
    }, [])

    const clear = useCallback(() => {
        setItems([])
    }, [])

    const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)

    return (
        <CartContext.Provider value={{ items, add, remove, setQuantity, clear, totalCount }}>
            {children}
        </CartContext.Provider>
    )
}