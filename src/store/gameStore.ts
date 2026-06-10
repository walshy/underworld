import { create } from 'zustand'

interface GameState {
  tick: number
  isLoading: boolean
}

interface GameActions {
  incrementTick: () => void
  setLoading: (isLoading: boolean) => void
}

export const useGameStore = create<GameState & GameActions>((set) => ({
  tick: 0,
  isLoading: false,
  incrementTick: () => set((state) => ({ tick: state.tick + 1 })),
  setLoading: (isLoading) => set({ isLoading }),
}))
