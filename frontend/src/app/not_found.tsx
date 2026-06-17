"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem", textAlign: "center",
      position: "relative", overflow: "hidden",
    }}>

      {/* Ambient glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      }}>
        <div style={{
          position: "absolute", top: "30%", left: "50%",
          transform: "translateX(-50%)",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(155,93,229,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "clamp(6rem, 20vw, 12rem)",
            fontWeight: 900, lineHeight: 1,
            letterSpacing: "-0.05em",
            background: "linear-gradient(135deg, #9b5de5 0%, #f15bb5 50%, #00bbf9 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "1rem",
          }}
        >
          404
        </motion.div>

        {/* Message */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            fontWeight: 800, color: "white",
            letterSpacing: "-0.02em", marginBottom: "0.75rem",
          }}
        >
          Fit Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{ color: "#555", fontSize: "1rem", marginBottom: "2.5rem" }}
        >
          This page doesn't exist. Let's get you back to rating fits.
        </motion.p>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(155,93,229,0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/")}
          style={{
            padding: "0.9rem 2rem",
            fontSize: "1rem", fontWeight: 700,
            borderRadius: "999px", border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #9b5de5 0%, #f15bb5 100%)",
            color: "white",
            boxShadow: "0 0 30px rgba(155,93,229,0.3)",
          }}
        >
          Back to Home
        </motion.button>
      </div>
    </main>
  )
}