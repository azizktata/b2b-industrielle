"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/Header"

interface FormState {
  prenom: string
  nom: string
  societe: string
  email: string
  telephone: string
  typePartenariat: string
  message: string
}

const EMPTY_FORM: FormState = {
  prenom: "",
  nom: "",
  societe: "",
  email: "",
  telephone: "",
  typePartenariat: "",
  message: "",
}

const TYPES_PARTENARIAT = [
  "Distributeur / Revendeur",
  "Représentation commerciale",
  "Projet industriel",
  "Prescripteur / Bureau d'études",
  "Autre",
]

const VALUES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="square">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.768-.231-1.48-.632-2.072M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.768.231-1.48.632-2.072m0 0a5.002 5.002 0 019.736 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Réseau Distributeurs",
    body: "Intégrez un réseau spécialisé régulation & vapeur avec un catalogue de marques reconnues, un support technique dédié et des conditions commerciales adaptées.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="square">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    title: "Projets Industrie",
    body: "Collaborez sur des projets industriels complexes : dimensionnement, sourcing multi-marques, assistance à la mise en œuvre sur réseaux vapeur, air comprimé et fluides.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="square">
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Représentation Marques",
    body: "Devenez représentant agréé de marques SAMSON, ADCA, iFm et d'autres fabricants européens leaders sur votre territoire ou secteur d'activité.",
  },
]

const STEPS = [
  {
    num: "01",
    title: "Prise de contact",
    body: "Soumettez votre demande via le formulaire. Notre équipe commerciale prend connaissance de votre profil et de vos objectifs.",
  },
  {
    num: "02",
    title: "Étude de compatibilité",
    body: "Nous analysons la complémentarité entre votre activité et notre offre : zones géographiques, secteurs industriels, synergies techniques.",
  },
  {
    num: "03",
    title: "Proposition commerciale",
    body: "Présentation des conditions, des outils mis à disposition (catalogue, support technique, formations) et des modalités de collaboration.",
  },
  {
    num: "04",
    title: "Démarrage",
    body: "Signature de l'accord-cadre, intégration dans nos systèmes et accompagnement au lancement avec nos équipes techniques et commerciales.",
  },
]

export default function PartenariatPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("submitting")
    setErrorMsg("")

    try {
      const res = await fetch("/api/partenariat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur inconnue")
      setStatus("success")
      setForm(EMPTY_FORM)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de l'envoi.")
      setStatus("error")
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
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
            <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-3">Message envoyé</p>
            <h1 className="font-display font-black text-ink text-3xl uppercase tracking-tight mb-4">
              Nous avons bien reçu votre demande
            </h1>
            <p className="text-ink-mid text-sm font-sans mb-8">
              Notre équipe commerciale vous recontactera sous 48h pour étudier votre opportunité.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] font-sans hover:bg-steel transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-surface">

        {/* ── HERO ── */}
        <section className="bg-navy-950 border-b border-white/8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-sans text-white/30 mb-8">
              <Link href="/" className="hover:text-white/60 transition-colors">Accueil</Link>
              <span>/</span>
              <span className="text-white/60">Partenariat</span>
            </nav>
            <div className="max-w-3xl">
              <p className="text-steel text-xs font-semibold uppercase tracking-[0.3em] font-sans mb-4">Opportunités Commerciales</p>
              <h1 className="font-display font-black text-white uppercase text-fluid-h2 tracking-tight leading-none mb-6">
                Développons nos marchés ensemble
              </h1>
              <p className="text-white/55 text-base font-sans leading-relaxed max-w-xl">
                SOGECOR accompagne distributeurs, bureaux d&apos;études et représentants commerciaux dans le développement de leurs activités sur les marchés de la régulation industrielle et du traitement de la vapeur.
              </p>
            </div>
          </div>
        </section>

        {/* ── VALUE PROPS ── */}
        <section className="bg-dim border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {VALUES.map(({ icon, title, body }) => (
                <div key={title} className="bg-surface p-8 lg:p-10 flex flex-col gap-5">
                  <div className="w-14 h-14 bg-navy-950 flex items-center justify-center text-steel shrink-0">
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-ink text-lg uppercase tracking-tight mb-3">{title}</h3>
                    <p className="text-ink-mid text-sm font-sans leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        {/* <section className="bg-dim border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-12">
              <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-3">Notre démarche</p>
              <h2 className="font-display font-black text-ink text-3xl lg:text-4xl uppercase tracking-tight leading-none">
                Comment ça fonctionne
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
              {STEPS.map(({ num, title, body }) => (
                <div key={num} className="bg-surface p-8 flex flex-col gap-4 relative">
                  <span className="font-display font-black text-5xl text-border leading-none select-none">{num}</span>
                  <div>
                    <h3 className="font-display font-bold text-ink text-base uppercase tracking-tight mb-2">{title}</h3>
                    <p className="text-ink-soft text-sm font-sans leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* ── CONTACT FORM ── */}
        <section id="contact" className="bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-16 items-start">

              {/* Left copy */}
              <div className="lg:sticky lg:top-28">
                <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-4">Nous contacter</p>
                <h2 className="font-display font-black text-ink text-3xl lg:text-4xl uppercase tracking-tight leading-none mb-6">
                  Parlons de votre projet
                </h2>
                <p className="text-ink-mid text-sm font-sans leading-relaxed mb-8 max-w-sm">
                  Décrivez votre activité et vos objectifs. Notre équipe commerciale étudiera votre demande et vous recontactera sous 48h ouvrées.
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Réponse garantie", detail: "sous 48h ouvrées" },
                    { label: "Interlocuteur dédié", detail: "équipe commerciale SOGECOR" },
                    { label: "Sans engagement", detail: "étude préliminaire gratuite" },
                  ].map(({ label, detail }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-steel flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="square">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <span className="text-sm font-sans text-ink-mid">
                        <strong className="text-ink font-semibold">{label}</strong> — {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right form */}
              <form onSubmit={handleSubmit} className="bg-white border border-border p-8 flex flex-col gap-5">
                <div className="h-1 bg-steel -mt-8 -mx-8 mb-3" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="prenom" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                      Prénom <span className="text-steel">*</span>
                    </label>
                    <input
                      id="prenom" name="prenom" type="text" required
                      value={form.prenom} onChange={handleField}
                      className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-steel transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nom" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                      Nom <span className="text-steel">*</span>
                    </label>
                    <input
                      id="nom" name="nom" type="text" required
                      value={form.nom} onChange={handleField}
                      className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-steel transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="societe" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                    Société
                  </label>
                  <input
                    id="societe" name="societe" type="text"
                    value={form.societe} onChange={handleField}
                    className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-steel transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                    Email professionnel <span className="text-steel">*</span>
                  </label>
                  <input
                    id="email" name="email" type="email" required
                    value={form.email} onChange={handleField}
                    placeholder="nom@entreprise.com"
                    className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink placeholder:text-ink-soft focus:outline-none focus:border-steel transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="telephone" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                    Téléphone
                  </label>
                  <input
                    id="telephone" name="telephone" type="tel"
                    value={form.telephone} onChange={handleField}
                    className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-steel transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="typePartenariat" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                    Type de partenariat <span className="text-steel">*</span>
                  </label>
                  <select
                    id="typePartenariat" name="typePartenariat" required
                    value={form.typePartenariat} onChange={handleField}
                    className="bg-dim border border-border px-3 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-steel transition-colors appearance-none"
                  >
                    <option value="" disabled>Sélectionner…</option>
                    {TYPES_PARTENARIAT.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.15em] font-sans text-ink-mid">
                    Décrivez votre activité / projet
                  </label>
                  <textarea
                    id="message" name="message" rows={4}
                    value={form.message} onChange={handleField}
                    placeholder="Secteur d'activité, zone géographique, objectifs…"
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
                      Envoyer ma demande
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="square">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-[10px] font-sans text-ink-soft text-center">
                  Réponse sous 48h ouvrées — aucun engagement.
                </p>
              </form>

            </div>
          </div>
        </section>

      </main>
    </>
  )
}
