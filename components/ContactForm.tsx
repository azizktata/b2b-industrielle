"use client"

import { useState, useEffect } from "react"

const SECTEURS = ["Industrie générale", "Agroalimentaire", "Pharmacie / Chimie", "Énergie / Utilities", "BTP / Génie climatique", "Papier / Carton", "Textile", "Autre"]

const EMPTY = { prenom: "", nom: "", societe: "", email: "", telephone: "", secteur: "", message: "", rgpd: false }

export default function ContactForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [toast, setToast] = useState(false)
  const [data, setData] = useState(EMPTY)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(false), 5000)
    return () => clearTimeout(t)
  }, [toast])

  function set(field: string, value: string | boolean) {
    setData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erreur inconnue")
      setData(EMPTY)
      setStatus("idle")
      setToast(true)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de l'envoi.")
      setStatus("error")
    }
  }

  const cols = compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"

  return (
    <>
      <form onSubmit={handleSubmit} className={`grid ${cols} gap-4`}>
        <Field label="Prénom *">
          <input type="text" required value={data.prenom} onChange={e => set("prenom", e.target.value)}
            className={INPUT} placeholder="Jean" />
        </Field>
        <Field label="Nom *">
          <input type="text" required value={data.nom} onChange={e => set("nom", e.target.value)}
            className={INPUT} placeholder="Dupont" />
        </Field>
        <Field label="Société *">
          <input type="text" required value={data.societe} onChange={e => set("societe", e.target.value)}
            className={INPUT} placeholder="Industries SA" />
        </Field>
        <Field label="Email *">
          <input type="email" required value={data.email} onChange={e => set("email", e.target.value)}
            className={INPUT} placeholder="j.dupont@societe.fr" />
        </Field>
        <Field label="Téléphone">
          <input type="tel" value={data.telephone} onChange={e => set("telephone", e.target.value)}
            className={INPUT} placeholder="+33 1 XX XX XX XX" />
        </Field>
        <Field label="Secteur d'activité *">
          <select required value={data.secteur} onChange={e => set("secteur", e.target.value)} className={SELECT}>
            <option value="">— Sélectionner —</option>
            {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <div className={compact ? "" : "sm:col-span-2"}>
          <Field label="Message *">
            <textarea
              required
              rows={compact ? 4 : 5}
              value={data.message}
              onChange={e => set("message", e.target.value)}
              className={INPUT + " resize-none"}
              placeholder="Décrivez votre besoin, les références, quantités, délais souhaités…"
            />
          </Field>
        </div>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input type="checkbox" required checked={data.rgpd} onChange={e => set("rgpd", e.target.checked)} className="sr-only" />
              <div className={`w-4 h-4 border transition-colors ${data.rgpd ? "bg-steel border-steel" : "border-border group-hover:border-ink-soft"}`}>
                {data.rgpd && (
                  <svg className="w-full h-full p-0.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="square">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs font-sans text-ink-mid leading-relaxed">
              J&apos;accepte que mes données soient traitées par Techniflux dans le cadre de cette demande.{" "}
              <a href="/confidentialite" className="text-steel hover:underline">Politique de confidentialité</a>.
            </span>
          </label>
        </div>

        {status === "error" && (
          <div className={compact ? "" : "sm:col-span-2"}>
            <p className="text-sm font-sans text-red-600 bg-red-50 border border-red-200 px-4 py-3">
              {errorMsg}
            </p>
          </div>
        )}

        <div className={compact ? "" : "sm:col-span-2"}>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors disabled:opacity-50"
          >
            {status === "submitting" ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Envoi en cours…
              </>
            ) : (
              <>
                Envoyer le message
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-navy-900 border border-steel/40 px-6 py-4 shadow-2xl min-w-[320px]">
          <div className="w-8 h-8 bg-steel flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="square">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-display font-bold uppercase tracking-tight">Message envoyé</p>
            <p className="text-white/50 text-xs font-sans mt-0.5">Nous revenons vers vous sous 24h ouvrées.</p>
          </div>
          <button onClick={() => setToast(false)} className="text-white/40 hover:text-white transition-colors ml-2" aria-label="Fermer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-ink-mid">{label}</span>
      {children}
    </label>
  )
}

const INPUT = "w-full bg-white border border-border text-ink text-sm font-sans px-4 py-3 focus:outline-none focus:border-steel/60 transition-colors placeholder:text-ink-soft/50"
const SELECT = "w-full bg-white border border-border text-ink text-sm font-sans px-4 py-3 focus:outline-none focus:border-steel/60 transition-colors appearance-none cursor-pointer"
