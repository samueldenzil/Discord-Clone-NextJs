import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useSocket } from '@/components/providers/socket-provider'
import { Member, Message, User } from '@prisma/client'

type ChatSocketProps = {
  addKey: string
  queryKey: string
  updateKey: string
}

type MessageWithMemberWithUser = Message & {
  member: Member & {
    user: User
  }
}

export default function useChatSocket({ addKey, queryKey, updateKey }: ChatSocketProps) {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.on(updateKey, (message: MessageWithMemberWithUser) => {
      queryClient.setQueriesData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithUser) => {
              if (item.id === message.id) {
                return message
              }
              return item
            }),
          }
        })

        return { ...oldData, pages: newData }
      })
    })

    socket.on(addKey, (message: MessageWithMemberWithUser) => {
      queryClient.setQueriesData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          }
        }

        const newData = [...oldData.pages]

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        }

        return { ...oldData, pages: newData }
      })
    })

    return () => {
      socket.off(addKey)
      socket.off(updateKey)
    }
  }, [queryClient, addKey, queryKey, socket, updateKey])
}
