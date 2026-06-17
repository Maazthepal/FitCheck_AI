import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Outfit Rater — Rate Your Fit",
  description: "AI-powered outfit analysis. Get your drip score instantly.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundColor: "#080808",
          color: "white",
          minHeight: "100vh",
        }}
      >
        {/* Ambient background glow */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: `
              radial-gradient(ellipse 80% 50% at 20% -10%, rgba(155, 93, 229, 0.15) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 110%, rgba(0, 187, 249, 0.1) 0%, transparent 60%)
            `,
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}