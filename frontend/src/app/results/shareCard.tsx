"use client"

import { forwardRef } from "react"

interface ShareCardProps {
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

function getDripLabel(score: number): string {
  if (score >= 90) return "Elite Fit"
  if (score >= 80) return "Strong Style Identity"
  if (score >= 70) return "Well Coordinated"
  if (score >= 60) return "Casual and Balanced"
  return "Needs Refinement"
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ scores, styleTypes, image, dominantColors }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "1080px",
          height: "1920px",
          background: "#080808",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Background gradients */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", top: "-100px", left: "-100px",
            width: "700px", height: "700px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(155,93,229,0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
          }} />
          <div style={{
            position: "absolute", bottom: "200px", right: "-100px",
            width: "600px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,187,249,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }} />
          <div style={{
            position: "absolute", top: "40%", left: "50%",
            transform: "translateX(-50%)",
            width: "800px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(241,91,181,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }} />
        </div>

        {/* Grid overlay for texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 2,
          display: "flex", flexDirection: "column",
          height: "100%", padding: "80px 80px 60px",
        }}>

          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: "60px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                background: "linear-gradient(135deg, #9b5de5, #f15bb5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px",
              }}>
                ✦
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>
                  FitCheck AI
                </div>
                <div style={{ fontSize: "16px", color: "#555", marginTop: "2px" }}>
                  AI Fashion Analysis
                </div>
              </div>
            </div>
            <div style={{
              padding: "10px 24px", borderRadius: "999px",
              background: "rgba(155,93,229,0.15)",
              border: "1px solid rgba(155,93,229,0.3)",
              fontSize: "18px", color: "#c084fc", fontWeight: 600,
            }}>
              Fit Report
            </div>
          </div>

          {/* Outfit Image */}
          {image && (
            <div style={{
              width: "100%", height: "580px",
              borderRadius: "32px", overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              marginBottom: "60px", position: "relative",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
              flexShrink: 0,
            }}>
              <img
                src={image} alt="outfit"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)",
              }} />
              {/* Style tag on image */}
              <div style={{
                position: "absolute", bottom: "28px", left: "32px",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                <div style={{
                  padding: "8px 20px", borderRadius: "999px",
                  background: "rgba(155,93,229,0.3)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(155,93,229,0.5)",
                  fontSize: "20px", color: "white", fontWeight: 700,
                }}>
                  {styleTypes[0]?.name}
                </div>
                <div style={{
                  padding: "8px 20px", borderRadius: "999px",
                  background: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "20px", color: "#aaa",
                }}>
                  {styleTypes[0]?.confidence}% match
                </div>
              </div>
            </div>
          )}

          {/* Drip Score — Hero */}
          <div style={{
            background: "rgba(155,93,229,0.08)",
            border: "1px solid rgba(155,93,229,0.2)",
            borderRadius: "28px", padding: "52px",
            textAlign: "center", marginBottom: "32px",
            position: "relative", overflow: "hidden",
            flexShrink: 0,
          }}>
            {/* Inner glow */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "400px", height: "200px",
              background: "radial-gradient(ellipse, rgba(155,93,229,0.2) 0%, transparent 70%)",
              filter: "blur(30px)", pointerEvents: "none",
            }} />

            <div style={{ fontSize: "22px", color: "#555", letterSpacing: "0.15em", marginBottom: "12px" }}>
              DRIP SCORE
            </div>
            <div style={{
              fontSize: "140px", fontWeight: 900, lineHeight: 1,
              background: "linear-gradient(135deg, #9b5de5 0%, #f15bb5 50%, #00bbf9 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", marginBottom: "8px",
            }}>
              {scores.drip_score}
            </div>
            <div style={{ fontSize: "26px", color: "#555", marginBottom: "20px" }}>/100</div>
            <div style={{
              display: "inline-block",
              padding: "12px 32px", borderRadius: "999px",
              background: "linear-gradient(135deg, rgba(155,93,229,0.2), rgba(241,91,181,0.2))",
              border: "1px solid rgba(155,93,229,0.3)",
              fontSize: "24px", fontWeight: 700, color: "white",
            }}>
              {getDripLabel(scores.drip_score)}
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div style={{
            display: "flex", gap: "24px",
            marginBottom: "32px", flexShrink: 0,
          }}>
            {[
              { label: "Color Harmony", value: scores.color_harmony, color: "#00bbf9" },
              { label: "Outfit Balance", value: scores.outfit_balance, color: "#f15bb5" },
              { label: "Style Confidence", value: scores.style_confidence, color: "#9b5de5" },
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1, padding: "36px 24px",
                borderRadius: "24px",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${item.color}22`,
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: "64px", fontWeight: 900,
                  color: item.color, lineHeight: 1,
                  marginBottom: "12px",
                  textShadow: `0 0 40px ${item.color}44`,
                }}>
                  {item.value}
                </div>
                <div style={{ fontSize: "18px", color: "#555", lineHeight: 1.4 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Color Palette */}
          {dominantColors.length > 0 && (
            <div style={{
              padding: "32px 40px",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid #1a1a1a",
              marginBottom: "32px",
              flexShrink: 0,
            }}>
              <div style={{ fontSize: "18px", color: "#444", letterSpacing: "0.1em", marginBottom: "20px" }}>
                COLOR PALETTE
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                {dominantColors.slice(0, 6).map((color, i) => (
                  <div key={i} style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: "8px",
                  }}>
                    <div style={{
                      width: "60px", height: "60px", borderRadius: "14px",
                      background: color,
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: `0 8px 24px ${color}44`,
                    }} />
                    <div style={{ fontSize: "14px", color: "#444", fontFamily: "monospace" }}>
                      {color}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Footer */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "40px",
            borderTop: "1px solid #1a1a1a",
          }}>
            <div style={{ fontSize: "22px", color: "#333" }}>
              fitcheck.ai
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              fontSize: "20px", color: "#333",
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "7px",
                background: "linear-gradient(135deg, #9b5de5, #f15bb5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", color: "white",
              }}>
                ✦
              </div>
              Rate your fit at FitCheck AI
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ShareCard.displayName = "ShareCard"
export default ShareCard