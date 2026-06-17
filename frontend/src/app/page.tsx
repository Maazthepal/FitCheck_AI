"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { useRouter } from "next/navigation"
import { Sparkles, Zap, Eye, ArrowRight, Star, Scan, } from "lucide-react"
import { useState, useEffect } from "react"

const ROTATING_WORDS = ["Outfit.", "Drip.", "Fit.", "Style.", "Look."]

const FLOATING_SCORES = [
  { label: "Drip Score", value: "94", color: "#9b5de5", top: "15%", left: "5%" },
  { label: "Color Harmony", value: "88", color: "#00bbf9", top: "25%", right: "5%" },
  { label: "Fit Balance", value: "91", color: "#f15bb5", bottom: "30%", left: "3%" },
  { label: "Style Match", value: "87", color: "#9b5de5", bottom: "20%", right: "5%" },
]

const TICKER_ITEMS = [
  "STREETWEAR", "SMART CASUAL", "DRIP SCORE", "COLOR HARMONY",
  "FIT CHECK", "OUTFIT RATING", "STYLE ANALYSIS", "LOOK OF THE DAY",
]

export default function LandingPage() {
  const router = useRouter()
  const [wordIndex, setWordIndex] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [hovering, setHovering] = useState(false)

  // Rotate words
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Track mouse for interactive glow
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Mouse-following glow */}
      <motion.div
        animate={{ x: mouseX - 200, y: mouseY - 200 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
        style={{
          position: "fixed",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(155,93,229,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
          filter: "blur(20px)",
        }}
      />

      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "10%", left: "5%",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(155,93,229,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, -25, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute", bottom: "10%", right: "5%",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,187,249,0.12) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            position: "absolute", top: "40%", right: "15%",
            width: "250px", height: "250px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(241,91,181,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Floating score cards */}
      {FLOATING_SCORES.map((score, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: 0.8 + i * 0.15 },
            scale: { delay: 0.8 + i * 0.15 },
            y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
          }}
          style={{
            position: "absolute",
            top: score.top,
            left: score.left,
            right: score.right,
            bottom: score.bottom,
            padding: "0.75rem 1.25rem",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${score.color}33`,
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
            zIndex: 1,
            minWidth: "120px",
          }}
        >
          <span style={{ fontSize: "0.7rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {score.label}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.2rem" }}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: "1.8rem", fontWeight: 800, color: score.color }}
            >
              {score.value}
            </motion.span>
            <span style={{ fontSize: "0.8rem", color: "#555" }}>/100</span>
          </div>
          <div style={{ height: "3px", borderRadius: "2px", background: "#1a1a1a", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.value}%` }}
              transition={{ delay: 1 + i * 0.2, duration: 1, ease: "easeOut" }}
              style={{ height: "100%", background: score.color, borderRadius: "2px" }}
            />
          </div>
        </motion.div>
      ))}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "700px" }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.4rem 1rem", borderRadius: "999px",
            border: "1px solid rgba(155,93,229,0.4)",
            background: "rgba(155,93,229,0.1)",
            marginBottom: "2rem", fontSize: "0.8rem", color: "#c084fc",
          }}
        >
          <motion.div
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Scan size={13} />
          </motion.div>
          AI-Powered Style Analysis
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(3rem, 10vw, 7rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
          }}
        >
          Rate Your{" "}
          <br />
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{
              background: "linear-gradient(135deg, #9b5de5 0%, #f15bb5 50%, #00bbf9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
            }}
          >
            {ROTATING_WORDS[wordIndex]}
          </motion.span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "#777",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
          }}
        >
          Upload your outfit photo and get an instant breakdown —
          style type, color harmony, fit balance, and real suggestions.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(155,93,229,0.5)" }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setHovering(true)}
            onHoverEnd={() => setHovering(false)}
            onClick={() => router.push("/upload")}
            style={{
              padding: "1rem 2.5rem",
              fontSize: "1.05rem",
              fontWeight: 700,
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #9b5de5 0%, #f15bb5 100%)",
              color: "white",
              boxShadow: "0 0 40px rgba(155,93,229,0.35)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Drop Your Fit
            <motion.div
              animate={{ x: hovering ? 4 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowRight size={18} />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            marginTop: "3.5rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "FREE", label: "No signup needed" },
            { value: "INSTANT", label: "Real-time analysis" },
            { value: "100", label: "Point drip scale" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              style={{ textAlign: "center" }}
            >
              <div style={{
                fontSize: "1.5rem", fontWeight: 800, color: "white",
                background: "linear-gradient(135deg, #9b5de5, #00bbf9)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#555", marginTop: "0.2rem" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom ticker */}
      <div
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          borderTop: "1px solid #1a1a1a",
          background: "rgba(8,8,8,0.8)",
          backdropFilter: "blur(10px)",
          overflow: "hidden", padding: "0.75rem 0", zIndex: 10,
        }}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", gap: "3rem", whiteSpace: "nowrap", width: "max-content" }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              style={{
                fontSize: "0.75rem", color: "#333",
                letterSpacing: "0.15em", fontWeight: 600,
                display: "flex", alignItems: "center", gap: "0.75rem",
              }}
            >
              <Star size={8} fill="#333" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </main>
  )
}