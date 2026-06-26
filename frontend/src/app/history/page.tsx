"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { useWindowSize } from "@/lib/hooks"
import { Clock, Zap, ArrowRight, Trash2 } from "lucide-react"
import { auth } from "@/lib/auth"


interface AnalysisRecord {
  id: string
  dripScore: number
  colorHarmony: number
  outfitBalance: number
  styleConfidence: number
  styleTypes: { name: string; confidence: number }[]
  imageUrl: string | null
  createdAt: string
}

function getDripLabel(score: number): string {
  if (score >= 90) return "Elite Fit"
  if (score >= 80) return "Strong Style Identity"
  if (score >= 70) return "Well Coordinated"
  if (score >= 60) return "Casual and Balanced"
  return "Needs Refinement"
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e"
  if (score >= 60) return "#9b5de5"
  return "#f15bb5"
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString()
}

export default async function HistoryPage() {
  const router = useRouter()
  const { width } = useWindowSize()
  const isMobile = width < 768
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/analysis/history")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setAnalyses(data.analyses)
      } catch {
        setError("Failed to load history")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <main style={{
      minHeight: "100vh",
      padding: isMobile ? "1rem" : "2rem",
      paddingTop: "5rem",
      position: "relative",
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "2rem" }}
        >
          <h1 style={{
            fontSize: isMobile ? "1.8rem" : "2.5rem",
            fontWeight: 900, letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}>
            Fit{" "}
            <span style={{
              background: "linear-gradient(135deg, #9b5de5, #f15bb5)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              History
            </span>
          </h1>
          <p style={{ color: "#555", fontSize: "0.9rem" }}>
            Your past outfit analyses
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div style={{
            display: "flex", justifyContent: "center",
            padding: "4rem",
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
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: "1rem", borderRadius: "12px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171", fontSize: "0.9rem",
          }}>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && analyses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center", padding: "4rem 2rem",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid #1a1a1a",
            }}
          >
            <div style={{
              width: "64px", height: "64px", borderRadius: "18px",
              background: "rgba(155,93,229,0.1)",
              border: "1px solid rgba(155,93,229,0.2)",
              display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 1.5rem",
            }}>
              <Clock size={28} color="#9b5de5" />
            </div>
            <h2 style={{
              fontSize: "1.3rem", fontWeight: 800,
              color: "white", marginBottom: "0.75rem",
            }}>
              No analyses yet
            </h2>
            <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Upload your first outfit to start tracking your drip
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/upload")}
              style={{
                padding: "0.85rem 1.75rem",
                borderRadius: "999px", border: "none",
                background: "linear-gradient(135deg, #9b5de5, #f15bb5)",
                color: "white", fontWeight: 700,
                cursor: "pointer", fontSize: "0.95rem",
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
              }}
            >
              Rate Your First Fit <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}

        {/* Analysis list */}
        {!loading && analyses.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Stats summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
                gap: "0.75rem",
                marginBottom: "0.5rem",
              }}
            >
              {[
                {
                  label: "Total Fits",
                  value: analyses.length,
                  color: "#9b5de5",
                },
                {
                  label: "Avg Drip Score",
                  value: Math.round(
                    analyses.reduce((a, b) => a + b.dripScore, 0) / analyses.length
                  ),
                  color: "#f15bb5",
                },
                {
                  label: "Best Score",
                  value: Math.max(...analyses.map((a) => a.dripScore)),
                  color: "#22c55e",
                },
                {
                  label: "Top Style",
                  value: analyses[0]?.styleTypes[0]?.name?.split(" ")[0] || "—",
                  color: "#00bbf9",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    padding: "1rem",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid #1a1a1a",
                    textAlign: "center",
                  }}
                >
                  <div style={{
                    fontSize: "1.4rem", fontWeight: 800,
                    color: stat.color, marginBottom: "0.25rem",
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#555" }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Individual cards */}
            {analyses.map((analysis, i) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid #1a1a1a",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <div style={{
                  display: "flex", alignItems: "center",
                  gap: "1rem", padding: "1.25rem",
                  flexWrap: isMobile ? "wrap" : "nowrap",
                }}>

                  {/* Score circle */}
                  <div style={{
                    width: "60px", height: "60px",
                    borderRadius: "50%", flexShrink: 0,
                    background: `rgba(${analysis.dripScore >= 80
                      ? "34,197,94"
                      : analysis.dripScore >= 60
                        ? "155,93,229"
                        : "241,91,181"}, 0.1)`,
                    border: `2px solid ${getScoreColor(analysis.dripScore)}33`,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{
                      fontSize: "1.1rem", fontWeight: 800,
                      color: getScoreColor(analysis.dripScore),
                      lineHeight: 1,
                    }}>
                      {analysis.dripScore}
                    </span>
                    <span style={{ fontSize: "0.55rem", color: "#555" }}>
                      /100
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: "flex", alignItems: "center",
                      gap: "0.5rem", marginBottom: "0.35rem",
                      flexWrap: "wrap",
                    }}>
                      <span style={{
                        fontSize: "0.95rem", fontWeight: 700, color: "white",
                      }}>
                        {analysis.styleTypes[0]?.name}
                      </span>
                      <span style={{
                        fontSize: "0.72rem", color: "#9b5de5",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "999px",
                        background: "rgba(155,93,229,0.1)",
                        border: "1px solid rgba(155,93,229,0.2)",
                      }}>
                        {getDripLabel(analysis.dripScore)}
                      </span>
                    </div>

                    {/* Mini scores */}
                    <div style={{
                      display: "flex", gap: "0.75rem",
                      flexWrap: "wrap",
                    }}>
                      {[
                        { label: "Color", value: analysis.colorHarmony, color: "#00bbf9" },
                        { label: "Balance", value: analysis.outfitBalance, color: "#f15bb5" },
                        { label: "Style", value: analysis.styleConfidence, color: "#9b5de5" },
                      ].map((s, j) => (
                        <span key={j} style={{
                          fontSize: "0.75rem", color: "#555",
                        }}>
                          <span style={{ color: s.color, fontWeight: 600 }}>{s.value}</span>
                          {" "}{s.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Time + icon */}
                  <div style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "flex-end", gap: "0.5rem",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: "0.75rem", color: "#444" }}>
                      {timeAgo(analysis.createdAt)}
                    </span>
                    <Zap size={14} color="#333" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 