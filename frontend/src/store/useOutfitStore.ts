import { create } from "zustand"
import { OutfitAnalysis, OutfitStore } from "@/lib/types"

const useOutfitStore = create<OutfitStore>((set) => ({
  image: null,
  file: null,
  analysis: null,
  isLoading: false,

  setImage: (image: string) => set({ image }),
  setFile: (file: File) => set({ file }),
  setAnalysis: (analysis: OutfitAnalysis) => set({ analysis }),
  setLoading: (isLoading: boolean) => set({ isLoading }),

  reset: () => set({
    image: null,
    file: null,
    analysis: null,
    isLoading: false
  })
}))

export default useOutfitStore