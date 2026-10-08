import type { Product } from './catalog'

export interface PromoBlock {
  id: number
  title: string
  text: string
  product: Product
}

export async function fetchPromos(): Promise<PromoBlock[]> {
  const res = await fetch('/api/promos')
  if (!res.ok) throw new Error('Failed to load promos')
  return res.json()
}