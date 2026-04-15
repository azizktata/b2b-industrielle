import type { Metadata } from "next"
import { Barlow_Condensed, Barlow } from "next/font/google"
import "./globals.css"

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-barlow-condensed",
})

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-barlow",
})

export const metadata: Metadata = {
  title: {
    template: "%s | LOGO",
    default: "LOGO — Spécialiste Régulation Vapeur & Robinetterie Industrielle",
  },
  description:
    "Distributeur agréé en robinetterie industrielle, régulation vapeur et instrumentation. Fiches techniques, dimensionnement et devis sous 12h pour les professionnels.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${barlowCondensed.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
