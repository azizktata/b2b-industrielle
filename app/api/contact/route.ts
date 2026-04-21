import { NextRequest, NextResponse } from "next/server"
import { sendContactEmail } from "@/lib/email"
import type { ContactMessage } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const contact = await req.json() as ContactMessage

    if (!contact?.email || !contact?.prenom || !contact?.nom || !contact?.message) {
      return NextResponse.json({ error: "Informations de contact incomplètes." }, { status: 400 })
    }

    await sendContactEmail(contact)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[POST /api/contact]", err)
    return NextResponse.json({ error: "Erreur lors de l'envoi. Veuillez réessayer." }, { status: 500 })
  }
}
