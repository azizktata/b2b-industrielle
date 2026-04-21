import type { Metadata } from "next"
import { Barlow_Condensed, Barlow } from "next/font/google"
import "./globals.css"
import { DevisProvider } from "@/components/DevisProvider"

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
    template: "%s | SOGECOR",
    default: "SOGECOR — Société Générale de Commerce et de Représentation",
  },
  description:
    "SOGECOR — Société Générale de Commerce et de Représentation",
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
      <body className="min-h-full flex flex-col"><DevisProvider>{children}</DevisProvider></body>
    </html>
  )
}
