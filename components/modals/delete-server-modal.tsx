'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import { useModalStore } from '@/hooks/use-modal-store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function DeleteServerModal() {
  const { isOpen, onOpen, onClose, type, data } = useModalStore()

  const router = useRouter()

  const isModalOpen = isOpen && type === 'deleteServer'
  const { server } = data

  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)

      axios.delete(`/api/servers/${server?.id}`)

      router.push('/')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">Delete Server</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this?
            <br />
            <span className="font-semibold text-indigo-500">{server?.name}</span> will be
            permanently deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={onClick}
              className="bg-rose-500 text-white hover:bg-rose-500/90"
              disabled={isLoading}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
