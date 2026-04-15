"use client"

import { useState, useEffect } from "react"

export default function QuickRFQ({ productRef, onClose }: { productRef: string | null, onClose: () => void }) {
  if (!productRef) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative bg-white border border-border w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-steel" />
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-steel text-[10px] font-bold uppercase tracking-widest mb-1">Demande de Devis Rapide</p>
              <h2 className="font-display font-black text-ink text-2xl uppercase">Réf: {productRef}</h2>
            </div>
            <button onClick={onClose} className="text-ink-soft hover:text-ink">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-ink-mid">Quantité</label>
                <input type="number" defaultValue="1" className="w-full bg-dim border border-border px-3 py-2 text-sm focus:outline-none focus:border-steel" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-ink-mid">Délai souhaité</label>
                <select className="w-full bg-dim border border-border px-3 py-2 text-sm focus:outline-none focus:border-steel">
                  <option>ASAP</option>
                  <option>1-2 semaines</option>
                  <option>Sur projet</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-ink-mid">Email Professionnel</label>
              <input type="email" placeholder="nom@entreprise.com" className="w-full bg-dim border border-border px-3 py-2 text-sm focus:outline-none focus:border-steel" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-ink-mid">Notes / Spécifications</label>
              <textarea rows={3} className="w-full bg-dim border border-border px-3 py-2 text-sm focus:outline-none focus:border-steel" placeholder="Ex: Brides PN40, dégraissage oxygène..."></textarea>
            </div>

            <button type="submit" className="w-full bg-navy-900 text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-steel transition-colors mt-4">
              Envoyer la demande rapide →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}