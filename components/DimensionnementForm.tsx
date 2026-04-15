"use client"

import { useState } from "react"

type FormState = "idle" | "submitting" | "success" | "error"

const FLUIDES = ["Vapeur saturée", "Vapeur surchauffée", "Air comprimé", "Eau chaude", "Eau surchauffée", "Huile thermique", "Autre"]
const TYPES_ETUDE = ["Sélection de produit", "Dimensionnement réseau", "Audit vapeur / bilan énergétique", "Étude CCTP / bureau d'études", "Autre"]
const SECTEURS = ["Industrie générale", "Agroalimentaire", "Pharmacie / Chimie", "Énergie / Utilities", "Papier / Carton", "Textile", "BTP / Génie climatique", "Autre"]

export default function DimensionnementForm() {
  const [state, setState] = useState<FormState>("idle")
  const [data, setData] = useState({
    prenom: "", nom: "", societe: "", email: "", telephone: "",
    secteur: "", typeEtude: "", fluide: "",
    pression: "", temperature: "", debit: "", dn: "",
    description: "", rgpd: false,
  })

  function set(field: string, value: string | boolean) {
    setData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState("submitting")
    // TODO: replace with real API call, e.g. POST /api/dimensionnement
    await new Promise(r => setTimeout(r, 900))
    setState("success")
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
        <div className="w-12 h-12 bg-steel flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="square">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <h3 className="font-display font-bold text-ink text-2xl uppercase tracking-tight mb-2">
            Demande Envoyée
          </h3>
          <p className="text-ink-mid text-sm font-sans max-w-sm">
            Nous avons bien reçu votre demande d&apos;étude. Notre équipe technique vous contacte sous 24 h ouvrées.
          </p>
        </div>
        <button
          onClick={() => { setState("idle"); setData({ prenom: "", nom: "", societe: "", email: "", telephone: "", secteur: "", typeEtude: "", fluide: "", pression: "", temperature: "", debit: "", dn: "", description: "", rgpd: false }) }}
          className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-steel hover:text-navy-800 transition-colors"
        >
          Nouvelle demande
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Contact */}
      <Field label="Prénom *" required>
        <input type="text" required value={data.prenom} onChange={e => set("prenom", e.target.value)}
          className={INPUT} placeholder="Jean" />
      </Field>
      <Field label="Nom *" required>
        <input type="text" required value={data.nom} onChange={e => set("nom", e.target.value)}
          className={INPUT} placeholder="Dupont" />
      </Field>
      <Field label="Société *" required>
        <input type="text" required value={data.societe} onChange={e => set("societe", e.target.value)}
          className={INPUT} placeholder="Industries SA" />
      </Field>
      <Field label="Email professionnel *" required>
        <input type="email" required value={data.email} onChange={e => set("email", e.target.value)}
          className={INPUT} placeholder="j.dupont@societe.fr" />
      </Field>
      <Field label="Téléphone">
        <input type="tel" value={data.telephone} onChange={e => set("telephone", e.target.value)}
          className={INPUT} placeholder="+33 1 XX XX XX XX" />
      </Field>
      <Field label="Secteur d'activité *" required>
        <select required value={data.secteur} onChange={e => set("secteur", e.target.value)} className={SELECT}>
          <option value="">— Sélectionner —</option>
          {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      {/* Study parameters */}
      <div className="md:col-span-2 pt-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] font-sans text-ink/40 mb-3">
          Paramètres de l&apos;étude
        </p>
        <div className="h-px bg-border" />
      </div>

      <Field label="Type d'étude *" required>
        <select required value={data.typeEtude} onChange={e => set("typeEtude", e.target.value)} className={SELECT}>
          <option value="">— Sélectionner —</option>
          {TYPES_ETUDE.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Fluide concerné *" required>
        <select required value={data.fluide} onChange={e => set("fluide", e.target.value)} className={SELECT}>
          <option value="">— Sélectionner —</option>
          {FLUIDES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </Field>
      <Field label="Pression (bar)">
        <input type="text" value={data.pression} onChange={e => set("pression", e.target.value)}
          className={INPUT} placeholder="ex : 6 bar · 6–10 bar" />
      </Field>
      <Field label="Température (°C)">
        <input type="text" value={data.temperature} onChange={e => set("temperature", e.target.value)}
          className={INPUT} placeholder="ex : 160 °C" />
      </Field>
      <Field label="Débit">
        <input type="text" value={data.debit} onChange={e => set("debit", e.target.value)}
          className={INPUT} placeholder="ex : 500 kg/h · 50 Nm³/h" />
      </Field>
      <Field label="DN souhaité">
        <input type="text" value={data.dn} onChange={e => set("dn", e.target.value)}
          className={INPUT} placeholder="ex : DN 25 · DN 50" />
      </Field>

      <div className="md:col-span-2">
        <Field label="Description du besoin *" required>
          <textarea
            required
            rows={4}
            value={data.description}
            onChange={e => set("description", e.target.value)}
            className={INPUT + " resize-none"}
            placeholder="Décrire le contexte de l'installation, les contraintes particulières, les normes applicables (ATEX, PED…), documents disponibles, etc."
          />
        </Field>
      </div>

      {/* RGPD */}
      <div className="md:col-span-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              required
              checked={data.rgpd}
              onChange={e => set("rgpd", e.target.checked)}
              className="sr-only"
            />
            <div className={`w-4 h-4 border transition-colors ${data.rgpd ? "bg-steel border-steel" : "border-border group-hover:border-ink-soft"}`}>
              {data.rgpd && (
                <svg className="w-full h-full p-0.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="square">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-xs font-sans text-ink-mid leading-relaxed">
            J&apos;accepte que mes données soient traitées par Techniflux dans le cadre de ma demande d&apos;étude.
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.
            Voir notre <a href="/confidentialite" className="text-steel hover:underline">politique de confidentialité</a>.
          </span>
        </label>
      </div>

      {/* Submit */}
      <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center gap-3 px-8 py-4 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === "submitting" ? "Envoi en cours…" : "Envoyer la demande d'étude"}
          {state !== "submitting" && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          )}
        </button>
        <p className="text-[10px] font-sans text-ink-soft">Réponse de notre équipe technique sous 24 h ouvrées.</p>
      </div>
    </form>
  )
}

function Field({ label, children, required: _req }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans text-ink-mid">{label}</span>
      {children}
    </label>
  )
}

const INPUT = "w-full bg-white border border-border text-ink text-sm font-sans px-4 py-3 focus:outline-none focus:border-steel/60 transition-colors placeholder:text-ink-soft/50"
const SELECT = "w-full bg-white border border-border text-ink text-sm font-sans px-4 py-3 focus:outline-none focus:border-steel/60 transition-colors appearance-none cursor-pointer"
