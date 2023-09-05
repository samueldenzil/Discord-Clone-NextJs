import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type ModalType = 'createServer'

type ModalState = {
  type: ModalType | null
  isOpen: boolean
  onOpen: (type: ModalType) => void
  onClose: () => void
}

export const useModalStore = create<ModalState>()(
  devtools((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type) => set({ isOpen: true, type }),
    onClose: () => set({ isOpen: false, type: null }),
  }))
)
