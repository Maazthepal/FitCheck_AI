"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut, User, Clock, Home, Swords } from "lucide-react"
import Link from "next/link"

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) return null

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 100, padding: "1rem 2rem",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(8,8,8,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #1a1a1a",
      }}
    >
      {/* Logo */}
      <Link href="/upload" style={{
        display: "flex", alignItems: "center",
        gap: "0.6rem", textDecoration: "none",
      }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "linear-gradient(135deg, #9b5de5, #f15bb5)",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "14px",
        }}>
          ✦
        </div>
        <span style={{
          fontSize: "1rem", fontWeight: 800,
          color: "white", letterSpacing: "-0.02em",
        }}>
          FitCheck AI
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <NavLink href="/upload" icon={<Home size={15} />} label="Rate Fit" />
        <NavLink href="/history" icon={<Clock size={15} />} label="History" />
        <NavLink href="/profile" icon={<User size={15} />} label="Profile" />
        <NavLink href="/compare" icon={<Swords size={15} />} label="Battle" />

        {/* User + Sign out */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "0.75rem", marginLeft: "0.5rem",
          paddingLeft: "0.75rem",
          borderLeft: "1px solid #1a1a1a",
        }}>
          <span style={{ fontSize: "0.8rem", color: "#555" }}>
            {session.user?.name?.split(" ")[0]}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.4rem 0.85rem", borderRadius: "999px",
              border: "1px solid #2a2a2a",
              background: "rgba(255,255,255,0.04)",
              color: "#666", cursor: "pointer", fontSize: "0.8rem",
            }}
          >
            <LogOut size={13} /> Sign out
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

function NavLink({ href, icon, label }: {
  href: string; icon: React.ReactNode; label: string
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          padding: "0.4rem 0.85rem", borderRadius: "999px",
          color: "#666", fontSize: "0.82rem",
          cursor: "pointer",
          transition: "color 0.2s ease",
        }}
        onHoverStart={(e) => {
          (e.target as HTMLElement).style.color = "white"
        }}
        onHoverEnd={(e) => {
          (e.target as HTMLElement).style.color = "#666"
        }}
      >
        {icon} {label}
      </motion.div>
    </Link>
  )
}