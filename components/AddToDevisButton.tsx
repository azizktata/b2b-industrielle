"use client"

import { useDevis } from "@/components/DevisProvider"

interface Props {
  product: { id: string; name: string; marque: string }
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function AddToDevisButton({ product, size = "sm", className }: Props) {
  const { addItem, removeItem, hasItem } = useDevis()
  const inBasket = hasItem(product.id)

  const base = className ?? (
    size === "sm"
      ? "text-[9px] font-bold uppercase tracking-[0.15em] font-sans px-3 py-1.5 transition-colors"
      : size === "md"
      ? "text-[10px] font-bold uppercase tracking-[0.2em] font-sans px-5 py-2.5 transition-colors"
      : "text-xs font-bold uppercase tracking-widest font-sans px-7 py-4 transition-colors"
  )

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (inBasket) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={inBasket ? `Retirer ${product.name} du devis` : `Ajouter ${product.name} au devis`}
      className={`${base} ${
        inBasket
          ? "bg-steel text-white border border-steel hover:bg-transparent hover:text-steel"
          : "border border-steel/60 text-steel hover:bg-steel hover:text-white cursor-pointer"
      }`}
    >
      {inBasket ? "Ajouté ✓" : "Devis +"}
    </button>
  )
}
