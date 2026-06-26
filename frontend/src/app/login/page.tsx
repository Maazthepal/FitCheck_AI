"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { Suspense } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError(null)


    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      if (result.error.includes("verify")) {
        setError("Please verify your email before logging in. Check your inbox.")
      } else {
        setError("Invalid email or password")
      }
      return
    }

    router.push("/upload")
    router.refresh()
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: "2rem",
      position: "relative", overflow: "hidden",
    }}>

      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "30%", left: "50%",
          transform: "translateX(-50%)",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(155,93,229,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%", maxWidth: "420px",
          position: "relative", zIndex: 2,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "14px",
            background: "linear-gradient(135deg, #9b5de5, #f15bb5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", margin: "0 auto 1rem",
          }}>
            ✦
          </div>
          <h1 style={{
            fontSize: "1.8rem", fontWeight: 900,
            letterSpacing: "-0.03em", marginBottom: "0.4rem",
          }}>
            Welcome back
          </h1>
          <p style={{ color: "#555", fontSize: "0.9rem" }}>
            Sign in to rate your fits
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid #1a1a1a",
          borderRadius: "24px", padding: "2rem",
        }}>

          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{
              display: "block", fontSize: "0.8rem",
              color: "#666", marginBottom: "0.5rem",
              letterSpacing: "0.05em",
            }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="maaz@example.com"
              style={{
                width: "100%", padding: "0.85rem 1rem",
                borderRadius: "12px", border: "1px solid #2a2a2a",
                background: "rgba(255,255,255,0.03)",
                color: "white", fontSize: "0.95rem",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block", fontSize: "0.8rem",
              color: "#666", marginBottom: "0.5rem",
              letterSpacing: "0.05em",
            }}>
              PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "0.85rem 3rem 0.85rem 1rem",
                  borderRadius: "12px", border: "1px solid #2a2a2a",
                  background: "rgba(255,255,255,0.03)",
                  color: "white", fontSize: "0.95rem",
                  outline: "none", boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "1rem", top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "#555", cursor: "pointer",
                  display: "flex", alignItems: "center",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "0.75rem 1rem", borderRadius: "10px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171", fontSize: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%", padding: "0.95rem",
              borderRadius: "12px", border: "none",
              background: loading
                ? "rgba(155,93,229,0.3)"
                : "linear-gradient(135deg, #9b5de5, #f15bb5)",
              color: "white", fontSize: "1rem",
              fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "0.5rem",
            }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: "18px", height: "18px", borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                }}
              />
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </motion.button>
        </div>

        {/* Register link */}
        <p style={{
          textAlign: "center", marginTop: "1.5rem",
          color: "#555", fontSize: "0.9rem",
        }}>
          Don't have an account?{" "}
          <Link href="/register" style={{
            color: "#9b5de5", fontWeight: 600,
            textDecoration: "none",
          }}>
            Sign up
          </Link>
        </p>
      </motion.div>
    </main>
  )
}