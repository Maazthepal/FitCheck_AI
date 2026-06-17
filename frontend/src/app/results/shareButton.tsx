"use client"

import { useState, useRef, useCallback } from "react"
import { toPng } from "html-to-image"
import { Share2, Download, Loader2, Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"

const ShareCard = dynamic(() => import("./shareCard"), { ssr: false })

interface ShareButtonProps {
  scores: {
    drip_score: number
    color_harmony: number
    outfit_balance: number
    style_confidence: number
  }
  styleTypes: { name: string; confidence: number }[]
  image: string | null
  dominantColors: string[]
}

type Status = "idle" | "generating" | "success" | "error"

const LOADING_STEPS = [
  "Generating social card...",
  "Applying premium style...",
  "Rendering your drip...",
  "Almost ready...",
]

export default function ShareButton({
  scores, styleTypes, image, dominantColors
}: ShareButtonProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [step, setStep] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const handleShare = useCallback(async () => {
    if (!cardRef.current || status === "generating") return

    setStatus("generating")
    setStep(0)

    // Cycle through loading steps
    const stepInterval = setInterval(() => {
      setStep((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1))
    }, 600)

    try {
      // Wait a tick for the hidden card to render
      await new Promise((r) => setTimeout(r, 100))

      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 1,
        cacheBust: true,
      })

      clearInterval(stepInterval)

      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], "fitcheck-result.png", { type: "image/png" })

      // Try native share first
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My FitCheck AI Result",
          text: `My Drip Score: ${scores.drip_score}/100 — ${styleTypes[0]?.name}`,
          files: [file],
        })
        setStatus("success")
        showToast("Shared successfully!", "success")
      } else {
        // Fallback: download
        const link = document.createElement("a")
        link.download = "fitcheck-result.png"
        link.href = dataUrl
        link.click()
        setStatus("success")
        showToast("Image downloaded!", "success")
      }
    } catch (err: any) {
      clearInterval(stepInterval)
      // User cancelled native share — not an error
      if (err?.name === "AbortError") {
        setStatus("idle")
        return
      }
      setStatus("error")
      showToast("Failed to generate image. Try again.", "error")
      console.error("Share error:", err)
    } finally {
      setTimeout(() => setStatus("idle"), 2000)
    }
  }, [status, scores, styleTypes, showToast])

  const isGenerating = status === "generating"
  const isSuccess = status === "success"

  return (
    <>
      {/* Hidden ShareCard — rendered off-screen for capture */}
      <div
        style={{
          position: "fixed",
          top: 0, left: "-9999px",
          zIndex: -1, pointerEvents: "none",
          opacity: 1,
        }}
        aria-hidden="true"
      >
        <ShareCard
          ref={cardRef}
          scores={scores}
          styleTypes={styleTypes}
          image={image}
          dominantColors={dominantColors}
        />
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: isGenerating ? 1 : 1.05 }}
        whileTap={{ scale: isGenerating ? 1 : 0.95 }}
        onClick={handleShare}
        disabled={isGenerating}
        aria-label="Share your fit results as an image"
        style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.65rem 1.3rem", borderRadius: "999px",
          border: isSuccess
            ? "1px solid rgba(34,197,94,0.4)"
            : "1px solid rgba(155,93,229,0.35)",
          background: isSuccess
            ? "rgba(34,197,94,0.1)"
            : isGenerating
              ? "rgba(155,93,229,0.05)"
              : "rgba(155,93,229,0.1)",
          color: isSuccess ? "#22c55e" : "#9b5de5",
          cursor: isGenerating ? "not-allowed" : "pointer",
          fontSize: "0.85rem", fontWeight: 600,
          transition: "all 0.2s ease",
          minWidth: "150px", justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={14} />
              </motion.div>
              {LOADING_STEPS[step]}
            </motion.div>
          )}
          {isSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Check size={14} /> Done!
            </motion.div>
          )}
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Share2 size={14} /> Share My Fit
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ef4444" }}
            >
              <X size={14} /> Failed
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: "fixed", bottom: "2rem", left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              background: toast.type === "success"
                ? "rgba(34,197,94,0.15)"
                : "rgba(239,68,68,0.15)",
              border: `1px solid ${toast.type === "success"
                ? "rgba(34,197,94,0.3)"
                : "rgba(239,68,68,0.3)"}`,
              color: toast.type === "success" ? "#22c55e" : "#f87171",
              fontSize: "0.9rem", fontWeight: 600,
              backdropFilter: "blur(10px)",
              display: "flex", alignItems: "center", gap: "0.5rem",
              whiteSpace: "nowrap",
            }}
          >
            {toast.type === "success" ? <Check size={16} /> : <X size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}