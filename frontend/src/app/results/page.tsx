"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback, memo } from "react"
import useOutfitStore from "@/store/useOutfitStore"
import { RotateCcw, Check } from "lucide-react"
import ShareButton from "@/app/results/shareButton"
import Image from "next/image"


// ─── Hooks ───────────────────────────────────────────────────────────────────

function useWindowSize() {
    const [size, setSize] = useState({ width: 1200, height: 800 })
    useEffect(() => {
        const update = () => setSize({ width: window.innerWidth, height: window.innerHeight })
        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])
    return size
}

function useClipboard(timeout = 2000) {
    const [copied, setCopied] = useState(false)
    const copy = useCallback((text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), timeout)
        })
    }, [timeout])
    return { copied, copy }
}

// ─── Animated Number ─────────────────────────────────────────────────────────

const AnimatedNumber = memo(({ target }: { target: number }) => {
    const [current, setCurrent] = useState(0)
    useEffect(() => {
        const steps = 60
        const increment = target / steps
        let step = 0
        const timer = setInterval(() => {
            step++
            setCurrent(Math.min(Math.round(increment * step), target))
            if (step >= steps) clearInterval(timer)
        }, 1500 / steps)
        return () => clearInterval(timer)
    }, [target])
    return <>{current}</>
})
AnimatedNumber.displayName = "AnimatedNumber"

// ─── Score Ring ───────────────────────────────────────────────────────────────

const ScoreRing = memo(({ score, color, size = 120 }: {
    score: number; color: string; size?: number
}) => {
    const radius = (size - 12) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference

    return (
        <div
            role="img"
            aria-label={`Score: ${score} out of 100`}
            style={{ position: "relative", width: size, height: size }}
        >
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="#1a1a1a" strokeWidth={6}
                />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke={color} strokeWidth={6}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
                />
            </svg>
            <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center",
                justifyContent: "center", flexDirection: "column",
            }}>
                <span style={{ fontSize: size * 0.22, fontWeight: 800, color: "white" }}>
                    <AnimatedNumber target={score} />
                </span>
                <span style={{ fontSize: size * 0.11, color: "#555" }}>/100</span>
            </div>
        </div>
    )
})
ScoreRing.displayName = "ScoreRing"

// ─── Color Swatch ─────────────────────────────────────────────────────────────

const ColorSwatch = memo(({ color }: { color: string }) => {
    const { copied, copy } = useClipboard()
    const [hovered, setHovered] = useState(false)

    return (
        <motion.div
            whileHover={{ scale: 1.08, y: -4 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            onClick={() => copy(color)}
            title={color}
            role="button"
            aria-label={`Copy color ${color}`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && copy(color)}
            style={{
                cursor: "pointer",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: "0.4rem",
                position: "relative",
            }}
        >
            <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: color,
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: hovered ? `0 8px 24px ${color}66` : `0 4px 12px ${color}33`,
                transition: "box-shadow 0.2s ease",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <AnimatePresence>
                    {copied && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                        >
                            <Check size={16} color="white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <span style={{ fontSize: "0.6rem", color: "#444", fontFamily: "monospace" }}>
                {color}
            </span>
            <AnimatePresence>
                {hovered && !copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        style={{
                            position: "absolute", bottom: "calc(100% + 8px)",
                            background: "#1a1a1a", border: "1px solid #2a2a2a",
                            borderRadius: "6px", padding: "0.3rem 0.6rem",
                            fontSize: "0.65rem", color: "#888", whiteSpace: "nowrap",
                        }}
                    >
                        Click to copy
                    </motion.div>
                )}
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        style={{
                            position: "absolute", bottom: "calc(100% + 8px)",
                            background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
                            borderRadius: "6px", padding: "0.3rem 0.6rem",
                            fontSize: "0.65rem", color: "#22c55e", whiteSpace: "nowrap",
                        }}
                    >
                        Copied!
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
})
ColorSwatch.displayName = "ColorSwatch"

// ─── Score Breakdown ──────────────────────────────────────────────────────────

const ScoreBreakdown = memo(({ scores, proportions }: { scores: any; proportions: any }) => {
    const factors = [
        {
            label: "Color Harmony",
            value: Math.round(scores.color_harmony * 0.3),
            positive: scores.color_harmony >= 60,
        },
        {
            label: "Outfit Proportions",
            value: Math.round(scores.outfit_balance * 0.2),
            positive: scores.outfit_balance >= 60,
        },
        {
            label: "Style Consistency",
            value: Math.round(scores.style_confidence * 0.5),
            positive: scores.style_confidence >= 60,
        },
        {
            label: "Fit Balance",
            value: proportions?.length_match === "poor" ? -8 : proportions?.length_match === "good" ? 5 : 2,
            positive: proportions?.length_match !== "poor",
        },
        {
            label: "Layering & Detail",
            value: scores.drip_score >= 80 ? 4 : -3,
            positive: scores.drip_score >= 80,
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
                borderRadius: "20px", padding: "1.5rem",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid #1a1a1a",
            }}
        >
            <p style={{
                fontSize: "0.7rem", color: "#555",
                letterSpacing: "0.1em", marginBottom: "1.25rem",
            }}>
                WHY THIS SCORE?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {factors.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", padding: "0.6rem 0.75rem",
                            borderRadius: "10px",
                            background: f.positive ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
                            border: `1px solid ${f.positive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"}`,
                        }}
                    >
                        <span style={{ fontSize: "0.82rem", color: "#888" }}>{f.label}</span>
                        <span style={{
                            fontSize: "0.85rem", fontWeight: 700,
                            color: f.positive ? "#22c55e" : "#ef4444",
                        }}>
                            {f.positive ? "+" : ""}{f.value}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
})
ScoreBreakdown.displayName = "ScoreBreakdown"

// ─── Outfit Strengths ─────────────────────────────────────────────────────────

const OutfitStrengths = memo(({ scores, proportions }: { scores: any; proportions: any }) => {
    const strengths: string[] = []

    if (scores.color_harmony >= 75) strengths.push("Strong color coordination")
    if (scores.outfit_balance >= 75) strengths.push("Balanced silhouette")
    if (scores.style_confidence >= 80) strengths.push("Clear style identity")
    if (proportions?.length_match === "good") strengths.push("Well-matched proportions")
    if (scores.drip_score >= 80) strengths.push("Premium overall presentation")
    if (scores.color_harmony >= 85) strengths.push("Excellent color harmony")

    if (strengths.length === 0) strengths.push("Consistent style direction")

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{
                borderRadius: "20px", padding: "1.5rem",
                background: "rgba(34,197,94,0.04)",
                border: "1px solid rgba(34,197,94,0.12)",
            }}
        >
            <p style={{
                fontSize: "0.7rem", color: "#555",
                letterSpacing: "0.1em", marginBottom: "1.25rem",
            }}>
                OUTFIT STRENGTHS
            </p>
            <div style={{
                display: "flex", flexWrap: "wrap", gap: "0.6rem",
            }}>
                {strengths.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.07 }}
                        style={{
                            display: "flex", alignItems: "center", gap: "0.4rem",
                            padding: "0.45rem 0.85rem", borderRadius: "999px",
                            background: "rgba(34,197,94,0.08)",
                            border: "1px solid rgba(34,197,94,0.2)",
                            fontSize: "0.8rem", color: "#22c55e",
                        }}
                    >
                        <Check size={12} />
                        {s}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
})
OutfitStrengths.displayName = "OutfitStrengths"

// ─── Drip Label ───────────────────────────────────────────────────────────────

function getDripLabel(score: number): string {
    if (score >= 90) return "Elite Fit"
    if (score >= 80) return "Strong Style Identity"
    if (score >= 70) return "Well Coordinated"
    if (score >= 60) return "Casual and Balanced"
    return "Needs Refinement"
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResultsPage() {
    const router = useRouter()
    const { analysis, image, reset } = useOutfitStore()
    const { width } = useWindowSize()

    const isMobile = width < 768
    const isTablet = width < 1024

    useEffect(() => {
        if (!analysis) router.push("/upload")
    }, [analysis, router])

    if (!analysis) return (
  <main style={{
    minHeight: "100vh",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: "center" }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{
          width: "40px", height: "40px", borderRadius: "50%",
          border: "2px solid #1a1a1a",
          borderTop: "2px solid #9b5de5",
          margin: "0 auto 1rem",
        }}
      />
      <p style={{ color: "#444", fontSize: "0.9rem" }}>Redirecting...</p>
    </motion.div>
  </main>
)

    const { style_types, scores, suggestions, dominant_colors, proportions, fit_balance } = analysis

    const handleReset = () => {
        reset()
        router.push("/upload")
    }

    return (
        <main
            role="main"
            style={{ minHeight: "100vh", padding: isMobile ? "1rem" : "2rem", position: "relative" }}
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", maxWidth: "1100px",
                    margin: "0 auto", marginBottom: isMobile ? "1.5rem" : "2rem",
                    flexWrap: "wrap", gap: "1rem",
                    paddingTop: isMobile ? "1rem" : "0",
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: isMobile ? "1.8rem" : "clamp(1.5rem, 4vw, 2.5rem)",
                            fontWeight: 900, letterSpacing: "-0.03em",
                        }}
                        aria-label="Your Fit Report"
                    >
                        Your{" "}
                        <span style={{
                            background: "linear-gradient(135deg, #9b5de5 0%, #f15bb5 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}>
                            Fit Report
                        </span>
                    </h1>
                    <p style={{ color: "#555", fontSize: "0.9rem", marginTop: "0.3rem" }}>
                        Here's what the AI thinks about your outfit
                    </p>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <ShareButton
                        scores={scores}
                        styleTypes={style_types}
                        image={image}
                        dominantColors={dominant_colors}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReset}
                        aria-label="Rate another outfit"
                        style={{
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            padding: "0.6rem 1.2rem", borderRadius: "999px",
                            border: "1px solid #2a2a2a",
                            background: "rgba(255,255,255,0.04)",
                            color: "#888", cursor: "pointer", fontSize: "0.85rem",
                        }}
                    >
                        <RotateCcw size={14} /> Rate Another
                    </motion.button>
                </div>
            </motion.div>

            {/* Main Grid */}
            <div style={{
                maxWidth: "1100px", margin: "0 auto",
                display: "grid",
                gridTemplateColumns: isMobile || isTablet ? "1fr" : "320px 1fr",
                gap: "1rem",
            }}>

                {/* LEFT COLUMN */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                    {/* Outfit image */}
                    {image && (
                        <motion.div
                            initial={{ opacity: 0, x: isMobile ? 0 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                borderRadius: "20px", overflow: "hidden",
                                border: "1px solid #1f1f1f", position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: isMobile ? "280px" : "380px",
                                }}
                            >
                                <Image
                                    src={image}
                                    alt="Your uploaded outfit"
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 320px"
                                    style={{
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                            <div style={{
                                position: "absolute", bottom: 0, left: 0, right: 0,
                                padding: "1.5rem",
                                background: "linear-gradient(transparent, rgba(8,8,8,0.95))",
                            }}>
                                <p style={{ fontSize: "0.7rem", color: "#555", marginBottom: "0.4rem", letterSpacing: "0.1em" }}>
                                    STYLE DETECTED
                                </p>
                                <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "white" }}>
                                    {style_types[0]?.name}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Style breakdown */}
                    <motion.div
                        initial={{ opacity: 0, x: isMobile ? 0 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            borderRadius: "20px", padding: "1.5rem",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid #1a1a1a",
                        }}
                    >
                        <p style={{ fontSize: "0.7rem", color: "#555", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                            STYLE BREAKDOWN
                        </p>
                        {style_types.map((style, i) => (
                            <div key={i} style={{ marginBottom: "0.85rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                                    <span style={{ fontSize: "0.85rem", color: "white" }}>{style.name}</span>
                                    <span style={{ fontSize: "0.85rem", color: "#9b5de5", fontWeight: 700 }}>
                                        {style.confidence}%
                                    </span>
                                </div>
                                <div style={{ height: "4px", borderRadius: "2px", background: "#1a1a1a" }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${style.confidence}%` }}
                                        transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                                        style={{
                                            height: "100%", borderRadius: "2px",
                                            background: i === 0
                                                ? "linear-gradient(90deg, #9b5de5, #f15bb5)"
                                                : "#2a2a2a",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Color palette */}
                    {dominant_colors.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: isMobile ? 0 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                borderRadius: "20px", padding: "1.5rem",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid #1a1a1a",
                            }}
                        >
                            <p style={{ fontSize: "0.7rem", color: "#555", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
                                COLOR PALETTE
                            </p>
                            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                                {dominant_colors.map((color, i) => (
                                    <ColorSwatch key={i} color={color} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                    {/* Drip Score hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            borderRadius: "20px", padding: isMobile ? "1.5rem" : "2rem",
                            background: "rgba(155,93,229,0.06)",
                            border: "1px solid rgba(155,93,229,0.2)",
                            display: "flex", alignItems: "center",
                            gap: "2rem", flexWrap: "wrap",
                        }}
                    >
                        <ScoreRing score={scores.drip_score} color="#9b5de5" size={isMobile ? 100 : 130} />
                        <div>
                            <p style={{ fontSize: "0.7rem", color: "#555", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                                OVERALL DRIP SCORE
                            </p>
                            <p style={{ fontSize: isMobile ? "2rem" : "2.5rem", fontWeight: 900, color: "white", lineHeight: 1 }}>
                                <AnimatedNumber target={scores.drip_score} />
                                <span style={{ fontSize: "1rem", color: "#555", fontWeight: 400 }}>/100</span>
                            </p>
                            <p style={{ color: "#9b5de5", fontSize: "0.95rem", marginTop: "0.5rem", fontWeight: 600 }}>
                                {getDripLabel(scores.drip_score)}
                            </p>
                        </div>
                    </motion.div>

                    {/* Score Breakdown — Why This Score */}
                    <ScoreBreakdown scores={scores} proportions={proportions} />

                    {/* 3 Score rings */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                        gap: "1rem",
                    }}>
                        {[
                            { label: "Color Harmony", score: scores.color_harmony, color: "#00bbf9" },
                            { label: "Outfit Balance", score: scores.outfit_balance, color: "#f15bb5" },
                            { label: "Style Confidence", score: scores.style_confidence, color: "#9b5de5" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                style={{
                                    borderRadius: "20px", padding: "1.5rem",
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid #1a1a1a",
                                    display: "flex",
                                    flexDirection: isMobile ? "row" : "column",
                                    alignItems: "center",
                                    gap: isMobile ? "1rem" : "0.75rem",
                                }}
                            >
                                <ScoreRing score={item.score} color={item.color} size={isMobile ? 70 : 90} />
                                <p style={{ fontSize: "0.78rem", color: "#555", textAlign: isMobile ? "left" : "center" }}>
                                    {item.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Proportions + Fit */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: "1rem",
                    }}>
                        {/* Proportions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                borderRadius: "20px", padding: "1.5rem",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid #1a1a1a",
                            }}
                        >
                            <p style={{ fontSize: "0.7rem", color: "#555", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                                PROPORTIONS
                            </p>
                            {[
                                { label: "Top Length", value: proportions?.shirt_length },
                                { label: "Bottom Length", value: proportions?.bottom_length },
                                { label: "Length Match", value: proportions?.length_match },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: "flex", justifyContent: "space-between",
                                    padding: "0.55rem 0",
                                    borderBottom: i < 2 ? "1px solid #111" : "none",
                                }}>
                                    <span style={{ fontSize: "0.8rem", color: "#555" }}>{item.label}</span>
                                    <span style={{
                                        fontSize: "0.8rem", fontWeight: 600, textTransform: "capitalize",
                                        color: item.value === "good" ? "#22c55e"
                                            : item.value === "poor" ? "#ef4444"
                                                : "white",
                                    }}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                            {proportions?.length_match_reason && (
                                <p style={{ fontSize: "0.75rem", color: "#444", marginTop: "0.75rem", lineHeight: 1.6 }}>
                                    {proportions.length_match_reason}
                                </p>
                            )}
                        </motion.div>

                        {/* Fit Balance */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            style={{
                                borderRadius: "20px", padding: "1.5rem",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid #1a1a1a",
                            }}
                        >
                            <p style={{ fontSize: "0.7rem", color: "#555", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                                FIT BALANCE
                            </p>
                            {[
                                { label: "Top Fit", value: fit_balance?.top_fit },
                                { label: "Bottom Fit", value: fit_balance?.bottom_fit },
                                { label: "Balance Score", value: `${fit_balance?.overall_balance}/100` },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: "flex", justifyContent: "space-between",
                                    padding: "0.55rem 0",
                                    borderBottom: i < 2 ? "1px solid #111" : "none",
                                }}>
                                    <span style={{ fontSize: "0.8rem", color: "#555" }}>{item.label}</span>
                                    <span style={{
                                        fontSize: "0.8rem", fontWeight: 600,
                                        color: "white", textTransform: "capitalize",
                                    }}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                            {fit_balance?.balance_reason && (
                                <p style={{ fontSize: "0.75rem", color: "#444", marginTop: "0.75rem", lineHeight: 1.6 }}>
                                    {fit_balance.balance_reason}
                                </p>
                            )}
                        </motion.div>
                    </div>

                    {/* Outfit Strengths */}
                    <OutfitStrengths scores={scores} proportions={proportions} />

                    {/* Suggestions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            borderRadius: "20px", padding: "1.5rem",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid #1a1a1a",
                        }}
                    >
                        <p style={{ fontSize: "0.7rem", color: "#555", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
                            STYLE SUGGESTIONS
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {suggestions.map((tip, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    style={{
                                        display: "flex", gap: "0.75rem", alignItems: "flex-start",
                                        padding: "0.9rem 1rem", borderRadius: "12px",
                                        background: "rgba(155,93,229,0.05)",
                                        border: "1px solid rgba(155,93,229,0.1)",
                                    }}
                                >
                                    <span style={{
                                        width: "24px", height: "24px", borderRadius: "7px",
                                        background: "rgba(155,93,229,0.15)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.7rem", fontWeight: 800, color: "#9b5de5",
                                        flexShrink: 0,
                                    }}>
                                        {i + 1}
                                    </span>
                                    <p style={{ fontSize: "0.85rem", color: "#aaa", lineHeight: 1.7 }}>
                                        {tip}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}