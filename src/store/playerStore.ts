import { create } from 'zustand'

interface PlayerState {
  cash: number
  dirtyMoney: number
  heat: number
  health: number
  rep: number
}

interface PlayerActions {
  setCash: (cash: number) => void
  addCash: (delta: number) => void
  setDirtyMoney: (dirtyMoney: number) => void
  addDirtyMoney: (delta: number) => void
  setHeat: (heat: number) => void
  addHeat: (delta: number) => void
  setHealth: (health: number) => void
}

export const usePlayerStore = create<PlayerState & PlayerActions>((set) => ({
  cash: 1_000,
  dirtyMoney: 0,
  heat: 0,
  health: 100,
  rep: 0,

  setCash: (cash) => set({ cash }),
  addCash: (delta) => set((s) => ({ cash: Math.max(0, s.cash + delta) })),
  setDirtyMoney: (dirtyMoney) => set({ dirtyMoney }),
  addDirtyMoney: (delta) => set((s) => ({ dirtyMoney: s.dirtyMoney + delta })),
  setHeat: (heat) => set({ heat }),
  addHeat: (delta) => set((s) => ({ heat: Math.min(100, Math.max(0, s.heat + delta)) })),
  setHealth: (health) => set({ health }),
}))
