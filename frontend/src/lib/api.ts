import { OutfitAnalysis } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function analyzeOutfit(file: File): Promise<OutfitAnalysis> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_URL}/api/v1/analyze`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Analysis failed")
  }

  return response.json()
}

export async function saveAnalysis(
  analysis: OutfitAnalysis,
  imageUrl?: string
): Promise<void> {
  try {
    await fetch("/api/analysis/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: imageUrl || null,
        dripScore: analysis.scores.drip_score,
        colorHarmony: analysis.scores.color_harmony,
        outfitBalance: analysis.scores.outfit_balance,
        styleConfidence: analysis.scores.style_confidence,
        styleTypes: analysis.style_types,
        proportions: analysis.proportions,
        fitBalance: analysis.fit_balance,
        suggestions: analysis.suggestions,
        dominantColors: analysis.dominant_colors,
      }),
    })
  } catch (error) {
    console.error("Failed to save analysis:", error)
    // Don't throw — saving failing shouldn't break the app
  }
}