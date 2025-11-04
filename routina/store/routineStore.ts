import { create } from 'zustand'
import type { RoutineBlock } from '@/lib/gemini'

interface DailyRoutineState {
  blocks: RoutineBlock[]
  setBlocks: (blocks: RoutineBlock[]) => void
  toggleBlockCompletion: (blockId: string) => void
  currentDate: string
  setCurrentDate: (date: string) => void
}

export const useDailyRoutineStore = create<DailyRoutineState>((set) => ({
  blocks: [],
  setBlocks: (blocks) => set({ blocks }),
  toggleBlockCompletion: (blockId) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === blockId ? { ...block, completed: !block.completed } : block
      )
    })),
  currentDate: new Date().toISOString().split('T')[0],
  setCurrentDate: (date) => set({ currentDate: date })
}))
