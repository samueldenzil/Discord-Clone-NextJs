'use client'

import { ChannelType, MemberRole } from '@prisma/client'
import { Plus, Settings } from 'lucide-react'

import { ServerWithMembersWithUsers } from '@/types'
import ActionTooltip from '../action-tooltip'
import { useModalStore } from '@/hooks/use-modal-store'

type ServerSectionProps = {
  label: string
  role?: MemberRole
  sectionType: 'channels' | 'members'
  channelType?: ChannelType
  server?: ServerWithMembersWithUsers
}

export default function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  const { onOpen } = useModalStore()

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">{label}</p>
      {role !== 'GUEST' && sectionType === 'channels' && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen('createChannel', { server, channelType })}
            className="text-zinc-500 transition-all hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}

      {role === 'ADMIN' && sectionType === 'members' && (
        <ActionTooltip label="Manage Member" side="top">
          <button
            onClick={() => onOpen('members', { server })}
            className="text-zinc-500 transition-all hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}
