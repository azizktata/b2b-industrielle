import { NextRequest, NextResponse } from "next/server"
import { sendDevisEmail } from "@/lib/email"
import type { DevisItem } from "@/components/DevisProvider"
import type { ContactInfo } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { items: DevisItem[]; contact: ContactInfo }

    const { items, contact } = body

    if (!contact?.email || !contact?.prenom || !contact?.nom) {
      return NextResponse.json({ error: "Informations de contact incomplètes." }, { status: 400 })
    }

    await sendDevisEmail(items, contact)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[POST /api/devis]", err)
    return NextResponse.json({ error: "Erreur lors de l'envoi. Veuillez réessayer." }, { status: 500 })
  }
}
