"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/Header"
import { useDevis } from "@/components/DevisProvider"

const FLUIDES = ["Vapeur", "Air comprimé", "Eau chaude / surchauffée", "Huile thermique", "Autre / Ne sait pas"]
const TYPES_PRODUIT = ["Robinetterie industrielle", "Régulation vapeur (purgeurs, détendeurs)", "Instrumentation", "Traitement des fluides", "Automatisme", "Autre / Je ne sais pas"]

interface ContactForm {
  prenom: string
  nom: string
  societe: string
  email: string
  telephone: string
  fluide: string
  typeProduit: string
  message: string
}

const EMPTY_FORM: ContactForm = {
  prenom: "",
  nom: "",
  societe: "",
  email: "",
  telephone: "",
  fluide: "",
  typeProduit: "",
  message: "",
}

export default function DevisPage() {
  const { items, removeItem, updateQty, clearItems, count } = useDevis()
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM)
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!items.length) return
    setStatus("submitting")
    setErrorMsg("")

    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, contact: form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur inconnue")
      setStatus("success")
      clearItems()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de l'envoi.")
      setStatus("error")
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <>
        <Header />
        <main className="bg-surface flex-1 flex items-center justify-center px-4 py-24">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-steel flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-3">Demande envoyée</p>
            <h1 className="font-display font-black text-ink text-3xl uppercase tracking-tight mb-4">
              Nous avons bien reçu votre demande
            </h1>
            <p className="text-ink-mid text-sm font-sans mb-8">
              Notre équipe technique vous contactera sous 24h avec un devis personnalisé.
            </p>
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors"
            >
              Retour au catalogue
            </Link>
          </div>
        </main>
      </>
    )
  }

  // ── Main devis page ───────────────────────────────────────────────────────
  return (
    <>
      <Header />
      <main className="bg-surface">

        {/* ── PAGE HEADER ── */}
        <section className="bg-navy-950 border-b border-white/8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-sans text-white/30 mb-6">
              <Link href="/" className="hover:text-white/60 transition-colors">Accueil</Link>
              <span>/</span>
              <span className="text-white/60">Demande de Devis</span>
            </nav>
            <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-3">Panier de Devis</p>
            <h1 className="font-display font-black text-white uppercase text-fluid-h2 tracking-tight leading-none">
              Votre Demande
            </h1>
            <p className="text-white/40 text-sm font-sans mt-3">
              {count > 0
                ? `${count} produit${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""} — réponse sous 24h.`
                : "Remplissez le formulaire et décrivez votre besoin — réponse sous 24h."}
            </p>
          </div>
        </section>

        {/* ── CONTENT ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">

            {/* ── LEFT: Product list ── */}
            <div>
              <div className="flex items-end justify-between mb-6">
                <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-tight">
                  Produits
                </h2>
                {count > 0 && (
                  <button
                    onClick={clearItems}
                    className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-ink-soft hover:text-steel transition-colors"
                  >
                    Vider le panier
                  </button>
                )}
              </div>

              {count === 0 && (
                <div className="bg-dim border border-border p-8 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 bg-surface border border-border flex items-center justify-center">
                    <svg className="w-5 h-5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="square">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-display font-bold text-ink text-base uppercase tracking-tight mb-1">Aucun produit sélectionné</p>
                    <p className="text-ink-soft text-sm font-sans">Vous pouvez tout de même envoyer une demande libre via le formulaire.</p>
                  </div>
                  <Link
                    href="/produits"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-ink-mid hover:border-steel hover:text-steel transition-colors"
                  >
                   Consulter le catalogue
                 
                  </Link>
                </div>
              )}

              <div className="flex flex-col gap-px">
                {items.map(item => (
                  <div key={item.id} className="bg-white border border-border p-5 flex items-center gap-5">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] text-ink-soft tracking-wider mb-1 truncate">{item.id}</p>
                      <p className="font-display font-bold text-ink text-base uppercase tracking-tight leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] font-sans text-ink-soft mt-1">
                        {item.marque}
                      </p>
                    </div>

                    {/* Qty stepper */}
                    <div className="flex items-center gap-0 shrink-0">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Diminuer la quantité"
                        className="w-8 h-8 border border-border flex items-center justify-center text-ink-mid hover:bg-dim disabled:opacity-30 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square"><path d="M5 12h14"/></svg>
                      </button>
                      <span className="w-10 h-8 border-y border-border flex items-center justify-center font-mono text-sm text-ink font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        aria-label="Augmenter la quantité"
                        className="w-8 h-8 border border-border flex items-center justify-center text-ink-mid hover:bg-dim transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square"><path d="M12 5v14M5 12h14"/></svg>
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Retirer ${item.name}`}
                      className="w-8 h-8 flex items-center justify-center text-ink-soft hover:text-steel transition-colors shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border flex items-center gap-3">
                <Link
                  href="/produits"
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-ink-mid hover:text-steel transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                    <path d="M19 12H5M11 6l-6 6 6 6" />
                  </svg>
                  Ajouter d&apos;autres produits
                </Link>
              </div>
            </div>

            {/* ── RIGHT: Contact form ── */}
            <div>
              <form onSubmit={handleSubmit} className="bg-white border border-border p-8">
                <div className="absolute top-0 inset-x-0 h-1 bg-steel" style={{ position: "relative" }} />

                <h2 className="font-display font-bold text-ink text-2xl uppercase tracking-tight mb-6">
                  Vos coordonnées
                </h2>

                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="prenom" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                        Prénom <span className="text-steel">*</span>
                      </label>
                      <input
                        id="prenom"
                        name="prenom"
                        type="text"
                        required
                        value={form.prenom}
                        onChange={handleField}
                        className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-steel transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="nom" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                        Nom <span className="text-steel">*</span>
                      </label>
                      <input
                        id="nom"
                        name="nom"
                        type="text"
                        required
                        value={form.nom}
                        onChange={handleField}
                        className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-steel transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="societe" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                      Société
                    </label>
                    <input
                      id="societe"
                      name="societe"
                      type="text"
                      value={form.societe}
                      onChange={handleField}
                      className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-steel transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                      Email professionnel <span className="text-steel">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleField}
                      placeholder="nom@entreprise.com"
                      className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink placeholder:text-ink-soft focus:outline-none focus:border-steel transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="telephone" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                      Téléphone
                    </label>
                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={form.telephone}
                      onChange={handleField}
                      className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-steel transition-colors"
                    />
                  </div>

                  {count === 0 && (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="fluide" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                          Fluide concerné <span className="text-steel">*</span>
                        </label>
                        <select
                          id="fluide"
                          name="fluide"
                          required
                          value={form.fluide}
                          onChange={handleField}
                          className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-steel transition-colors appearance-none"
                        >
                          <option value="" disabled>— Sélectionner —</option>
                          {FLUIDES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="typeProduit" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                          Type de produit recherché <span className="text-steel">*</span>
                        </label>
                        <select
                          id="typeProduit"
                          name="typeProduit"
                          required
                          value={form.typeProduit}
                          onChange={handleField}
                          className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-steel transition-colors appearance-none"
                        >
                          <option value="" disabled>— Sélectionner —</option>
                          {TYPES_PRODUIT.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                      Message / spécifications
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleField}
                      placeholder="Ex : Brides PN40, dégraissage oxygène, délai souhaité…"
                      className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink placeholder:text-ink-soft focus:outline-none focus:border-steel transition-colors resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-sm font-sans text-red-600 bg-red-50 border border-red-200 px-4 py-3">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full bg-navy-900 text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        Envoyer la demande de devis
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] font-sans text-ink-soft text-center">
                    Réponse garantie sous 24h ouvrées — aucun engagement.
                  </p>
                </div>
              </form>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
