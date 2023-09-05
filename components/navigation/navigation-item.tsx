'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import ActionTooltip from '@/components/action-tooltip'

type NavigationItemProps = {
  id: string
  imgUrl: string
  name: string
}

export default function NavigationItem({ id, imgUrl, name }: NavigationItemProps) {
  const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/servers/${id}`)
  }

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full w-1 transition-all',
            params?.serverId !== id && 'group-hover:h-5',
            params?.serverId === id ? 'h-9' : 'h-2'
          )}
        />
        <div
          className={cn(
            'relative mx-3 group h-12 w-12 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            params?.serverId === id && 'bg-primary/10 text-primary rounded-[16px]'
          )}
        >
          <Image src={imgUrl} fill alt={`${name} server image`} />
        </div>
      </button>
    </ActionTooltip>
  )
}
