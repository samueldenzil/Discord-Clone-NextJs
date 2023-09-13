import { Hash } from 'lucide-react'
import MobileToggle from '@/components/mobile-toggle'
import UserAvatar from '../user-avatar'

type ChatHeaderProps = {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  imageUrl: string
}

export default function ChatHeader({ serverId, name, type, imageUrl }: ChatHeaderProps) {
  return (
    <div className="flex items-center px-3 h-12 font-semibold border-b-2 border-neutral-200 dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl} className="h-8 w-8 mr-2 md:h-8 md:w-8" />
      )}
      <p className="font-semibold text-black dark:text-white">{name}</p>
    </div>
  )
}
