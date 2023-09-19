'use client'

import { useParams, useRouter } from 'next/navigation'
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client'
import { Edit, HashIcon, Lock, Mic, Trash, Video } from 'lucide-react'

import { cn } from '@/lib/utils'
import ActionTooltip from '@/components/action-tooltip'
import { ModalType, useModalStore } from '@/hooks/use-modal-store'

type ServerChannelProps = {
  channel: Channel
  server: Server
  role?: MemberRole
}

const iconMap = {
  [ChannelType.TEXT]: HashIcon,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
}

export default function ServerChannel({ channel, server, role }: ServerChannelProps) {
  const { onOpen } = useModalStore()
  const router = useRouter()
  const params = useParams()

  const Icon = iconMap[channel.type]

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
  }

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()
    onOpen(action, { server, channel })
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group px-2 py-2 mb-1 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <Icon className="flex shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-all',
          params?.channelId === channel.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, 'editChannel')}
              className="hidden group-hover:block h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-all"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, 'deleteChannel')}
              className="hidden group-hover:block h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-all"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className="ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  )
}
