"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error("App error:", error)
  }, [error])

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem", textAlign: "center",
      position: "relative", overflow: "hidden",
    }}>

      {/* Ambient glow — red tint for error */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      }}>
        <div style={{
          position: "absolute", top: "30%", left: "50%",
          transform: "translateX(-50%)",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: "480px" }}>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          style={{ fontSize: "4rem", marginBottom: "1.5rem" }}
        >
          ⚠️
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            fontWeight: 800, color: "white",
            letterSpacing: "-0.02em", marginBottom: "0.75rem",
          }}
        >
          Something Went Wrong
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            color: "#555", fontSize: "0.95rem",
            marginBottom: "0.75rem", lineHeight: 1.6,
          }}
        >
          {error.message || "An unexpected error occurred."}
        </motion.p>

        {error.digest && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            style={{
              fontSize: "0.75rem", color: "#333",
              fontFamily: "monospace", marginBottom: "2rem",
            }}
          >
            Error ID: {error.digest}
          </motion.p>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={reset}
            style={{
              padding: "0.85rem 1.75rem",
              fontSize: "0.95rem", fontWeight: 700,
              borderRadius: "999px", border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #9b5de5 0%, #f15bb5 100%)",
              color: "white",
              boxShadow: "0 0 30px rgba(155,93,229,0.3)",
            }}
          >
            Try Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/upload")}
            style={{
              padding: "0.85rem 1.75rem",
              fontSize: "0.95rem", fontWeight: 700,
              borderRadius: "999px", cursor: "pointer",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #2a2a2a", color: "#888",
            }}
          >
            Upload Again
          </motion.button>
        </motion.div>
      </div>
    </main>
  )
}