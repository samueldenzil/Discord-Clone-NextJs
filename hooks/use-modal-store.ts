import { Server } from '@prisma/client'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type ModalType = 'createServer' | 'invite' | 'editServer'

type ModalData = {
  server?: Server
}

type ModalState = {
  type: ModalType | null
  data: ModalData
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

export const useModalStore = create<ModalState>()(
  devtools((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null }),
  }))
)
