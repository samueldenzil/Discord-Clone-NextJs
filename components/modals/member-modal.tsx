'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react'
import queryString from 'query-string'
import axios from 'axios'
import { MemberRole } from '@prisma/client'

import { useModalStore } from '@/hooks/use-modal-store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import UserAvatar from '@/components/user-avatar'
import { ServerWithMembersWithUsers } from '@/types'

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
}

export default function MemberModal() {
  const { isOpen, onOpen, onClose, type, data } = useModalStore()

  const router = useRouter()
  const [loadingId, setLoadingId] = useState('')

  const isModalOpen = isOpen && type === 'members'
  const { server } = data as { server: ServerWithMembersWithUsers }

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)

      const url = queryString.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      })

      const response = await axios.delete(url)

      router.refresh()
      onOpen('members', { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)

      const url = queryString.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      })

      const response = await axios.patch(url, { role })

      router.refresh()
      onOpen('members', { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">Manage Members</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members.length > 1
              ? `${server?.members.length} Members`
              : `${server?.members.length} Member`}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px]">
          {server?.members.map((member) => (
            <div className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.user.image as string} className="" />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center">
                  {member.user.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.user.email}</p>
              </div>
              {member.userId !== server.userId && loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="w-4 h-4 mr-2" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => onRoleChange(member.id, 'GUEST')}>
                              <Shield className="h-4 w-4 mr-2" />
                              Guest
                              {member.role === 'GUEST' && <Check className="h-4 w-4 ml-auto" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onRoleChange(member.id, 'MODERATOR')}>
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Moderator
                              {member.role === 'MODERATOR' && <Check className="h-4 w-4 ml-auto" />}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member.id)}>
                        <Gavel className="h-4 w-4 mr-2" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && (
                <Loader2 className="w-4 h-4 ml-auto text-zinc-500 animate-spin" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
