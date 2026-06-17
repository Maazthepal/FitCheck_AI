"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useOutfitStore from "@/store/useOutfitStore"
import { analyzeOutfit } from "@/lib/api"
import { useWindowSize } from "@/lib/hooks"

const LOADING_TEXTS = [
  "Reading your drip...",
  "Analyzing color harmony...",
  "Checking fit balance...",
  "Judging your proportions...",
  "Calculating drip score...",
  "Almost there...",
]

export default function AnalyzingPage() {
  const router = useRouter()
  const { file, setAnalysis } = useOutfitStore()
  const [textIndex, setTextIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const { width } = useWindowSize()
  const isMobile = width < 768

  // Redirect guard
  useEffect(() => {
    if (!file) {
      router.push("/upload")
    } else {
      setReady(true)
    }
  }, [file, router])

  // Cycle loading texts
  useEffect(() => {
    if (!ready) return
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [ready])

  // Animate progress bar
  useEffect(() => {
    if (!ready) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 8
      })
    }, 400)
    return () => clearInterval(interval)
  }, [ready])

  // API call
  useEffect(() => {
    if (!ready || !file) return

    const run = async () => {
      try {
        const result = await analyzeOutfit(file)
        setAnalysis(result)
        setProgress(100)
        setTimeout(() => router.push("/results"), 500)
      } catch (err: any) {
        setError(err.message || "Something went wrong. Please try again.")
      }
    }

    run()
  }, [ready, file, router, setAnalysis])

  // Spinner while redirecting
  if (!ready) return (
    <main style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{
          width: "40px", height: "40px", borderRadius: "50%",
          border: "2px solid #1a1a1a",
          borderTop: "2px solid #9b5de5",
        }}
      />
    </main>
  )

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "1.5rem 1rem" : "2rem",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(155,93,229,0.15) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
        }}
      />

      <div style={{
        position: "relative", zIndex: 2,
        textAlign: "center",
        maxWidth: "480px",
        width: "100%",
        padding: isMobile ? "0 1rem" : "0",
      }}>
        {!error ? (
          <>
            {/* Spinning rings */}
            <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 2.5rem" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50%",
                  border: "2px solid transparent",
                  borderTop: "2px solid #9b5de5",
                  borderRight: "2px solid #f15bb5",
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute", inset: "8px",
                  borderRadius: "50%",
                  border: "2px solid transparent",
                  borderTop: "2px solid #00bbf9",
                  borderLeft: "2px solid #f15bb5",
                }}
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <div style={{
                  width: "12px", height: "12px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #9b5de5, #f15bb5)",
                  boxShadow: "0 0 20px rgba(155,93,229,0.8)",
                }} />
              </motion.div>
            </div>

            {/* Cycling text */}
            <AnimatePresence mode="wait">
              <motion.h2
                key={textIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                transition={{ duration: 0.4 }}
                style={{
                  fontSize: isMobile ? "1.2rem" : "1.4rem",
                  fontWeight: 700, color: "white",
                  marginBottom: "0.75rem", letterSpacing: "-0.02em",
                }}
              >
                {LOADING_TEXTS[textIndex]}
              </motion.h2>
            </AnimatePresence>

            <p style={{ color: "#444", fontSize: "0.9rem", marginBottom: "2.5rem" }}>
              This usually takes 3–5 seconds
            </p>

            {/* Progress bar */}
            <div style={{
              width: "100%", height: "4px",
              borderRadius: "999px", background: "#1a1a1a",
              overflow: "hidden", marginBottom: "1rem",
            }}>
              <motion.div
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  height: "100%", borderRadius: "999px",
                  background: "linear-gradient(90deg, #9b5de5, #f15bb5, #00bbf9)",
                }}
              />
            </div>

            <p style={{ fontSize: "0.8rem", color: "#333" }}>
              {Math.min(Math.round(progress), 100)}%
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: "2rem", borderRadius: "20px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</p>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>
              Analysis Failed
            </h2>
            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              {error}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/upload")}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "999px", border: "none",
                background: "linear-gradient(135deg, #9b5de5, #f15bb5)",
                color: "white", fontWeight: 700,
                cursor: "pointer", fontSize: "0.95rem",
              }}
            >
              Try Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </main>
  )
}