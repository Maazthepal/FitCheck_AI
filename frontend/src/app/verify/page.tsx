"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, ArrowRight, Mail } from "lucide-react"

type Status = "loading" | "success" | "error"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<Status>("loading")
  const [message, setMessage] = useState("")
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link. No token provided.")
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/verify?token=${encodeURIComponent(token)}`, {
          cache: "no-store",
        })

        if (res.redirected) {
          window.location.href = res.url
          return
        }

        const data = await res.json().catch(() => ({}))
        setStatus("error")
        setMessage(data.error || "Verification failed. Please try again.")
      } catch {
        setStatus("error")
        setMessage("Could not reach server. Please check your connection.")
      }
    }

    verify()
  }, [token, router])

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: "2rem",
      position: "relative", overflow: "hidden",
    }}>

      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <motion.div
          animate={{
            scale: status === "success" ? [1, 1.2, 1] : [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "30%", left: "50%",
            transform: "translateX(-50%)",
            width: "600px", height: "600px", borderRadius: "50%",
            background: status === "success"
              ? "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)"
              : status === "error"
                ? "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(155,93,229,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
            transition: "background 0.5s ease",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%", maxWidth: "420px",
          position: "relative", zIndex: 2,
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            width: "52px", height: "52px", borderRadius: "14px",
            background: "linear-gradient(135deg, #9b5de5, #f15bb5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", margin: "0 auto 2rem",
          }}
        >
          ✦
        </motion.div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid #1a1a1a",
          borderRadius: "24px", padding: "2.5rem 2rem",
        }}>

          <AnimatePresence mode="wait">

            {/* Loading State */}
            {status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
              >
                {/* Spinning rings */}
                <div style={{ position: "relative", width: "80px", height: "80px" }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{
                      position: "absolute", inset: 0, borderRadius: "50%",
                      border: "2px solid transparent",
                      borderTop: "2px solid #9b5de5",
                      borderRight: "2px solid #f15bb5",
                    }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{
                      position: "absolute", inset: "10px", borderRadius: "50%",
                      border: "2px solid transparent",
                      borderTop: "2px solid #00bbf9",
                      borderLeft: "2px solid #f15bb5",
                    }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Mail size={18} color="#9b5de5" />
                  </div>
                </div>

                <div>
                  <h2 style={{
                    fontSize: "1.4rem", fontWeight: 800,
                    color: "white", letterSpacing: "-0.02em",
                    marginBottom: "0.5rem",
                  }}>
                    Verifying your email
                  </h2>
                  <p style={{ color: "#555", fontSize: "0.9rem" }}>
                    Just a moment...
                  </p>
                </div>

                {/* Loading bar */}
                <div style={{
                  width: "100%", height: "3px",
                  borderRadius: "999px", background: "#1a1a1a",
                  overflow: "hidden",
                }}>
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      width: "50%", height: "100%",
                      background: "linear-gradient(90deg, #9b5de5, #f15bb5, #00bbf9)",
                      borderRadius: "999px",
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  style={{
                    width: "80px", height: "80px", borderRadius: "50%",
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <CheckCircle size={36} color="#22c55e" />
                </motion.div>

                <div>
                  <h2 style={{
                    fontSize: "1.4rem", fontWeight: 800,
                    color: "white", letterSpacing: "-0.02em",
                    marginBottom: "0.5rem",
                  }}>
                    Email verified!
                  </h2>
                  <p style={{ color: "#555", fontSize: "0.9rem" }}>
                    Your account is ready. Redirecting to login...
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/login?verified=true")}
                  style={{
                    width: "100%", padding: "0.85rem",
                    borderRadius: "12px", border: "none",
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    color: "white", fontSize: "0.95rem",
                    fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "0.5rem",
                  }}
                >
                  Go to Login <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            )}

            {/* Error State */}
            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  style={{
                    width: "80px", height: "80px", borderRadius: "50%",
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <XCircle size={36} color="#ef4444" />
                </motion.div>

                <div>
                  <h2 style={{
                    fontSize: "1.4rem", fontWeight: 800,
                    color: "white", letterSpacing: "-0.02em",
                    marginBottom: "0.5rem",
                  }}>
                    Verification failed
                  </h2>
                  <p style={{ color: "#555", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {message}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/register")}
                    style={{
                      width: "100%", padding: "0.85rem",
                      borderRadius: "12px", border: "none",
                      background: "linear-gradient(135deg, #9b5de5, #f15bb5)",
                      color: "white", fontSize: "0.95rem",
                      fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", gap: "0.5rem",
                    }}
                  >
                    Register Again <ArrowRight size={16} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/login")}
                    style={{
                      width: "100%", padding: "0.85rem",
                      borderRadius: "12px", cursor: "pointer",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid #2a2a2a",
                      color: "#888", fontSize: "0.95rem", fontWeight: 600,
                    }}
                  >
                    Back to Login
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom text */}
        <p style={{
          marginTop: "1.5rem", color: "#333",
          fontSize: "0.8rem", lineHeight: 1.6,
        }}>
          Didn't receive an email?{" "}
          <span
            onClick={() => router.push("/register")}
            style={{ color: "#9b5de5", cursor: "pointer", fontWeight: 600 }}
          >
            Register again
          </span>
        </p>
      </motion.div>
    </main>
  )
}