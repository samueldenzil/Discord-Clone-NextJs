'use client'

import queryString from 'query-string'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Video, VideoOff } from 'lucide-react'
import ActionTooltip from '../action-tooltip'

export default function ChatVideoButton() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isVideo = searchParams?.get('video')

  const Icon = isVideo ? VideoOff : Video
  const tooltipLabel = isVideo ? 'End video call' : 'Start video call'

  const onClick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathname || '',
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    )
    router.push(url)
  }

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="mr-4 hover:opacity-75 transition">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  )
}
