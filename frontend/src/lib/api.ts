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