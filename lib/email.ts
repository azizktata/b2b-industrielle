import nodemailer from "nodemailer"
import type { DevisItem } from "@/components/DevisProvider"

export interface ContactInfo {
  prenom: string
  nom: string
  societe: string
  email: string
  telephone: string
  marque: string
  fluide: string
  typeProduit: string
  message: string
}

export interface PartenariatContact {
  prenom: string
  nom: string
  societe: string
  email: string
  telephone: string
  typePartenariat: string
  message: string
}

function buildTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendDevisEmail(items: DevisItem[], contact: ContactInfo) {
  const transporter = buildTransporter()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sogecor.tn"

  const productRows = items
    .map(
      item => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-family:monospace;font-size:12px;color:#6b7280">${item.id}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600"><a href="${siteUrl}/produits/${item.id}" style="color:#1e3a5f;text-decoration:none" target="_blank">${item.name}</a></td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#6b7280">${item.marque}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;font-weight:700">${item.quantity}</td>
      </tr>`
    )
    .join("")

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Demande de devis</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:sans-serif">
  <div style="max-width:640px;margin:32px auto;background:#fff;border:1px solid #e5e7eb">
    <div style="background:#1e3a5f;padding:24px 32px">
      <p style="margin:0;color:#60a5fa;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase">Nouvelle Demande de Devis</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em">
        ${contact.societe || `${contact.prenom} ${contact.nom}`}
      </h1>
    </div>

    <div style="padding:32px">
      <h2 style="margin:0 0 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6b7280">Produits demandés</h2>
      ${items.length > 0 ? `
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb">
        <thead>
          <tr style="background:#f9fafb">
            <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280">Référence</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280">Produit</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280">Marque</th>
            <th style="padding:8px 12px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280">Qté</th>
          </tr>
        </thead>
        <tbody>${productRows}</tbody>
      </table>` : `
      <p style="margin:0;padding:12px 16px;background:#f9fafb;border:1px solid #e5e7eb;font-size:13px;color:#6b7280;font-style:italic">Aucun produit spécifié — demande libre.</p>`}

      <h2 style="margin:32px 0 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6b7280">Contact</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280;width:120px">Nom</td><td style="padding:6px 0;font-size:13px;font-weight:600">${contact.prenom} ${contact.nom}</td></tr>
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Société</td><td style="padding:6px 0;font-size:13px;font-weight:600">${contact.societe || "—"}</td></tr>
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Email</td><td style="padding:6px 0;font-size:13px"><a href="mailto:${contact.email}" style="color:#2563eb">${contact.email}</a></td></tr>
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Téléphone</td><td style="padding:6px 0;font-size:13px">${contact.telephone || "—"}</td></tr>
        ${contact.marque ? `<tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Marque</td><td style="padding:6px 0;font-size:13px;font-weight:600">${contact.marque}</td></tr>` : ""}
        ${contact.fluide ? `<tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Fluide</td><td style="padding:6px 0;font-size:13px">${contact.fluide}</td></tr>` : ""}
        ${contact.typeProduit ? `<tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Type de produit</td><td style="padding:6px 0;font-size:13px">${contact.typeProduit}</td></tr>` : ""}
      </table>

      ${contact.message ? `
      <h2 style="margin:32px 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6b7280">Message</h2>
      <p style="margin:0;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;font-size:13px;line-height:1.6;white-space:pre-wrap">${contact.message}</p>
      ` : ""}
    </div>

    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb">
      <p style="margin:0;font-size:10px;color:#9ca3af">Envoyé depuis SOGECOR — Demande de devis.</p>
    </div>
  </div>
</body>
</html>`

  await transporter.sendMail({
    from: `"SOGECOR " <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: contact.email,
    subject: `Demande de devis — ${contact.societe || contact.email}${items.length > 0 ? ` (${items.length} produit${items.length > 1 ? "s" : ""})` : " (demande libre)"}`,
    html,
  })
}

export interface ContactMessage {
  prenom: string
  nom: string
  societe: string
  email: string
  telephone: string
  secteur: string
  message: string
}

export async function sendContactEmail(contact: ContactMessage) {
  const transporter = buildTransporter()

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Message de contact</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:sans-serif">
  <div style="max-width:640px;margin:32px auto;background:#fff;border:1px solid #e5e7eb">
    <div style="background:#1e3a5f;padding:24px 32px">
      <p style="margin:0;color:#60a5fa;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase">Nouveau Message</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em">
        ${contact.societe || `${contact.prenom} ${contact.nom}`}
      </h1>
    </div>

    <div style="padding:32px">
      <h2 style="margin:0 0 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6b7280">Contact</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280;width:130px">Nom</td><td style="padding:6px 0;font-size:13px;font-weight:600">${contact.prenom} ${contact.nom}</td></tr>
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Société</td><td style="padding:6px 0;font-size:13px;font-weight:600">${contact.societe || "—"}</td></tr>
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Email</td><td style="padding:6px 0;font-size:13px"><a href="mailto:${contact.email}" style="color:#2563eb">${contact.email}</a></td></tr>
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Téléphone</td><td style="padding:6px 0;font-size:13px">${contact.telephone || "—"}</td></tr>
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Secteur</td><td style="padding:6px 0;font-size:13px">${contact.secteur || "—"}</td></tr>
      </table>

      <h2 style="margin:32px 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6b7280">Message</h2>
      <p style="margin:0;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;font-size:13px;line-height:1.6;white-space:pre-wrap">${contact.message}</p>
    </div>

    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb">
      <p style="margin:0;font-size:10px;color:#9ca3af">Envoyé depuis SOGECOR — Message de contact.</p>
    </div>
  </div>
</body>
</html>`

  await transporter.sendMail({
    from: `"SOGECOR " <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: contact.email,
    subject: `Message de contact — ${contact.societe || `${contact.prenom} ${contact.nom}`}${contact.secteur ? ` (${contact.secteur})` : ""}`,
    html,
  })
}

export async function sendPartenariatEmail(contact: PartenariatContact) {
  const transporter = buildTransporter()

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Opportunité Partenariat</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:sans-serif">
  <div style="max-width:640px;margin:32px auto;background:#fff;border:1px solid #e5e7eb">
    <div style="background:#1e3a5f;padding:24px 32px">
      <p style="margin:0;color:#60a5fa;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase">Nouvelle Opportunité</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em">
        ${contact.societe || `${contact.prenom} ${contact.nom}`}
      </h1>
    </div>

    <div style="padding:32px">
      <h2 style="margin:0 0 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6b7280">Type de partenariat</h2>
      <p style="margin:0 0 24px;padding:12px 16px;background:#f9fafb;border:1px solid #e5e7eb;font-size:14px;font-weight:700;color:#1e3a5f">${contact.typePartenariat}</p>

      <h2 style="margin:0 0 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6b7280">Contact</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280;width:120px">Nom</td><td style="padding:6px 0;font-size:13px;font-weight:600">${contact.prenom} ${contact.nom}</td></tr>
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Société</td><td style="padding:6px 0;font-size:13px;font-weight:600">${contact.societe || "—"}</td></tr>
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Email</td><td style="padding:6px 0;font-size:13px"><a href="mailto:${contact.email}" style="color:#2563eb">${contact.email}</a></td></tr>
        <tr><td style="padding:6px 0;font-size:11px;color:#6b7280">Téléphone</td><td style="padding:6px 0;font-size:13px">${contact.telephone || "—"}</td></tr>
      </table>

      ${contact.message ? `
      <h2 style="margin:32px 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6b7280">Message</h2>
      <p style="margin:0;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;font-size:13px;line-height:1.6;white-space:pre-wrap">${contact.message}</p>
      ` : ""}
    </div>

    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb">
      <p style="margin:0;font-size:10px;color:#9ca3af">Envoyé depuis site SOGECOR — demande de partenariat.</p>
    </div>
  </div>
</body>
</html>`

  await transporter.sendMail({
    from: `"SOGECOR " <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL_COMMERCIAL,
    replyTo: contact.email,
    subject: `Opportunité partenariat — ${contact.societe || contact.email} (${contact.typePartenariat})`,
    html,
  })
}
