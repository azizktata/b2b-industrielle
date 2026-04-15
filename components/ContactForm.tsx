"use client"

import { useState } from "react"

type FormState = "idle" | "submitting" | "success"

const SECTEURS = ["Industrie générale", "Agroalimentaire", "Pharmacie / Chimie", "Énergie / Utilities", "BTP / Génie climatique", "Papier / Carton", "Textile", "Autre"]
const FLUIDES = ["Vapeur", "Air comprimé", "Eau chaude / surchauffée", "Huile thermique", "Autre / Ne sait pas"]
const TYPES_PRODUIT = ["Robinetterie industrielle", "Régulation vapeur (purgeurs, détendeurs)", "Instrumentation", "Traitement des fluides", "Automatisme", "Autre / Je ne sais pas"]

export default function ContactForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<FormState>("idle")
  const [data, setData] = useState({
    prenom: "", nom: "", societe: "", email: "", telephone: "",
    secteur: "", fluide: "", typeProduit: "", message: "", rgpd: false,
  })

  function set(field: string, value: string | boolean) {
    setData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState("submitting")
    // TODO: replace with real API call, e.g. POST /api/contact
    await new Promise(r => setTimeout(r, 800))
    setState("success")
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-5">
        <div className="w-10 h-10 bg-steel flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="square">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <h3 className="font-display font-bold text-ink text-xl uppercase tracking-tight mb-1">
            Message Reçu
          </h3>
          <p className="text-ink-mid text-sm font-sans max-w-xs">
            Nous revenons vers vous dans les 24 h ouvrées.
          </p>
        </div>
        <button
          onClick={() => { setState("idle"); setData({ prenom: "", nom: "", societe: "", email: "", telephone: "", secteur: "", fluide: "", typeProduit: "", message: "", rgpd: false }) }}
          className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-steel hover:text-navy-800 transition-colors"
        >
          Nouveau message
        </button>
      </div>
    )
  }

  const cols = compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"

  return (
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
      <Field label="Fluide concerné *">
        <select required value={data.fluide} onChange={e => set("fluide", e.target.value)} className={SELECT}>
          <option value="">— Sélectionner —</option>
          {FLUIDES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </Field>
      <Field label="Type de produit recherché *">
        <select required value={data.typeProduit} onChange={e => set("typeProduit", e.target.value)} className={SELECT}>
          <option value="">— Sélectionner —</option>
          {TYPES_PRODUIT.map(t => <option key={t} value={t}>{t}</option>)}
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
            J&apos;accepte que mes données soient traitées par Techniflux dans le cadre de cette demande. {" "}
            <a href="/confidentialite" className="text-steel hover:underline">Politique de confidentialité</a>.
          </span>
        </label>
      </div>
      <div className={compact ? "" : "sm:col-span-2"}>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors disabled:opacity-50"
        >
          {state === "submitting" ? "Envoi…" : "Envoyer le message"}
          {state !== "submitting" && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          )}
        </button>
      </div>
    </form>
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
