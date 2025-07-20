import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"
import { ForcePasswordChange } from "@/components/force-password-change"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistem Pendataan UMKM - RT/RW",
  description: "Platform untuk pendataan dan manajemen UMKM mikro di tingkat RT/RW",
  keywords: "UMKM, RT/RW, pendataan, usaha mikro, manajemen data",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-background text-foreground`}>
        {" "}
        {/* Apply new background and text colors */}
        <AuthProvider>
          <ForcePasswordChange />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
