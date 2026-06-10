import { create } from 'zustand'
import type { DrugId } from '../lib/drugs'

export type SlotStatus = 'empty' | 'running' | 'ready'

export interface DrugSlot {
  id: number
  status: SlotStatus
  drugId: DrugId | null
  startedAt: number | null
  completesAt: number | null
}

export interface InventoryItem {
  id: string
  drugId: DrugId
  name: string
  value: number
}

function emptySlot(id: number): DrugSlot {
  return { id, status: 'empty', drugId: null, startedAt: null, completesAt: null }
}

let _nextItemId = 0

interface DrugState {
  slots: DrugSlot[]
  inventory: InventoryItem[]
  earnedToday: number
  opsToday: number
  heatContribution: number
}

interface DrugActions {
  startOp: (slotId: number, drugId: DrugId, durationMs: number, heat: number) => void
  markReady: (slotId: number) => void
  collectSlot: (slotId: number, drugId: DrugId, name: string, value: number) => void
  sellItem: (itemId: string) => number
  sellAll: () => number
}

export const useDrugStore = create<DrugState & DrugActions>((set, get) => ({
  slots: [emptySlot(0), emptySlot(1), emptySlot(2)],
  inventory: [],
  earnedToday: 0,
  opsToday: 0,
  heatContribution: 0,

  startOp: (slotId, drugId, durationMs, heat) => {
    const now = Date.now()
    set((s) => ({
      slots: s.slots.map((slot) =>
        slot.id === slotId
          ? { ...slot, status: 'running' as SlotStatus, drugId, startedAt: now, completesAt: now + durationMs }
          : slot
      ),
      opsToday: s.opsToday + 1,
      heatContribution: s.heatContribution + heat,
    }))
  },

  markReady: (slotId) =>
    set((s) => ({
      slots: s.slots.map((slot) =>
        slot.id === slotId && slot.status === 'running'
          ? { ...slot, status: 'ready' as SlotStatus }
          : slot
      ),
    })),

  collectSlot: (slotId, drugId, name, value) =>
    set((s) => ({
      slots: s.slots.map((slot) => (slot.id === slotId ? emptySlot(slotId) : slot)),
      inventory: [...s.inventory, { id: `item_${++_nextItemId}`, drugId, name, value }],
    })),

  sellItem: (itemId) => {
    const item = get().inventory.find((i) => i.id === itemId)
    if (!item) return 0
    set((s) => ({
      inventory: s.inventory.filter((i) => i.id !== itemId),
      earnedToday: s.earnedToday + item.value,
    }))
    return item.value
  },

  sellAll: () => {
    const items = get().inventory
    if (items.length === 0) return 0
    const total = items.reduce((sum, i) => sum + i.value, 0)
    set((s) => ({
      inventory: [],
      earnedToday: s.earnedToday + total,
    }))
    return total
  },
}))
