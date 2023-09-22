'use client'

import { ServerWithMembersWithUsers } from '@/types'
import { MemberRole } from '@prisma/client'
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useModalStore } from '@/hooks/use-modal-store'

type ServerHeaderProps = {
  server: ServerWithMembersWithUsers
  role?: MemberRole
}

export default function ServerHeader({ server, role }: ServerHeaderProps) {
  const { onOpen } = useModalStore()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  return (
    <div
      style={{ backgroundImage: `url(${server.imageUrl})` }}
      className="relative h-[135px] border-b-2 border-neutral-200 bg-cover bg-center dark:border-neutral-800"
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="relative z-10 focus:outline-none" asChild>
          <button className="flex h-12 w-full items-center px-3 font-semibold transition-all hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
            {server.name}
            <ChevronDown className="ml-auto h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 space-y-2 text-xs font-medium text-black dark:text-neutral-400">
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen('invite', { server })}
              className="cursor-pointer px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400"
            >
              Invite People
              <UserPlus className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen('editServer', { server })}
              className="cursor-pointer px-3 py-2 text-sm"
            >
              Server Settings
              <Settings className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen('members', { server })}
              className="cursor-pointer px-3 py-2 text-sm"
            >
              Manage Members
              <Users className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen('createChannel', { server })}
              className="cursor-pointer px-3 py-2 text-sm"
            >
              Create Channel
              <PlusCircle className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen('deleteServer', { server })}
              className="cursor-pointer px-3 py-2 text-sm text-rose-500"
            >
              Delete Server
              <Trash className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen('leaveServer', { server })}
              className="cursor-pointer px-3 py-2 text-sm text-rose-500"
            >
              Leave Server
              <LogOut className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 opacity-90" />
    </div>
  )
}
