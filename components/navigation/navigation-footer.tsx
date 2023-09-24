'use client'

import { signOut } from 'next-auth/react'
import { User } from '@prisma/client'
import { LogOut, Settings, Trash } from 'lucide-react'

import { useModalStore } from '@/hooks/use-modal-store'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { ModeToggle } from '@/components/mode-toggle'
import UserAvatar from '@/components/user-avatar'

type NavigationFooterProps = {
  user: User
}

export default function NavigationFooter({ user }: NavigationFooterProps) {
  const { onOpen } = useModalStore()

  return (
    <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar src={user.image!} className="cursor-pointer md:h-11 md:w-11" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 space-y-2 text-xs font-medium text-black dark:text-neutral-400">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onOpen('editUser', { user })}
            className="cursor-pointer px-3 py-2"
          >
            Account Settings
            <Settings className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer px-3 py-2">
            Logout
            <LogOut className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer px-3 py-2 text-rose-500">
            Delete User
            <Trash className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
