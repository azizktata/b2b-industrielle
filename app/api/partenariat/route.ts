import { NextRequest, NextResponse } from "next/server"
import { sendPartenariatEmail } from "@/lib/email"
import type { PartenariatContact } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { contact: PartenariatContact }
    const { contact } = body

    if (!contact?.email || !contact?.prenom || !contact?.nom) {
      return NextResponse.json({ error: "Informations de contact incomplètes." }, { status: 400 })
    }

    await sendPartenariatEmail(contact)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[POST /api/partenariat]", err)
    return NextResponse.json({ error: "Erreur lors de l'envoi. Veuillez réessayer." }, { status: 500 })
  }
}
