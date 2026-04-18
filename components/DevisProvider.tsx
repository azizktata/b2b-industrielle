"use client"

import { createContext, useContext, useEffect, useState } from "react"

export interface DevisItem {
  id: string
  name: string
  marque: string
  quantity: number
}

interface DevisContextType {
  items: DevisItem[]
  count: number
  addItem: (product: Omit<DevisItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearItems: () => void
  hasItem: (id: string) => boolean
}

const DevisContext = createContext<DevisContextType | null>(null)

export function DevisProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<DevisItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("devis")
      if (stored) setItems(JSON.parse(stored))
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem("devis", JSON.stringify(items))
  }, [items, hydrated])

  function addItem(product: Omit<DevisItem, "quantity">) {
    setItems(prev =>
      prev.some(i => i.id === product.id)
        ? prev
        : [...prev, { ...product, quantity: 1 }]
    )
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function updateQty(id: string, qty: number) {
    if (qty < 1) return
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  function clearItems() {
    setItems([])
  }

  function hasItem(id: string) {
    return items.some(i => i.id === id)
  }

  return (
    <DevisContext.Provider value={{
      items,
      count: items.length,
      addItem,
      removeItem,
      updateQty,
      clearItems,
      hasItem,
    }}>
      {children}
    </DevisContext.Provider>
  )
}

export function useDevis() {
  const ctx = useContext(DevisContext)
  if (!ctx) throw new Error("useDevis must be used inside DevisProvider")
  return ctx
}
