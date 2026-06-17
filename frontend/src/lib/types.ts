export interface StyleType {
  name: string
  confidence: number
}

export interface Proportions {
  shirt_length: string
  bottom_length: string
  length_match: string
  length_match_reason: string
}

export interface FitBalance {
  top_fit: string
  bottom_fit: string
  overall_balance: number
  balance_reason: string
}

export interface Scores {
  drip_score: number
  color_harmony: number
  outfit_balance: number
  style_confidence: number
}

export interface OutfitAnalysis {
  style_types: StyleType[]
  proportions: Proportions
  fit_balance: FitBalance
  scores: Scores
  suggestions: string[]
  dominant_colors: string[]
  error: string | null
}

export interface OutfitStore {
  image: string | null
  file: File | null
  analysis: OutfitAnalysis | null
  isLoading: boolean
  setImage: (image: string) => void
  setFile: (file: File) => void
  setAnalysis: (analysis: OutfitAnalysis) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}