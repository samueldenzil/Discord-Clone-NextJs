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
            'absolute left-0 w-1 rounded-r-full bg-primary transition-all',
            params?.serverId !== id && 'group-hover:h-5',
            params?.serverId === id ? 'h-9' : 'h-2'
          )}
        />
        <div
          className={cn(
            'group relative mx-3 h-12 w-12 overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]',
            params?.serverId === id && 'rounded-[16px] bg-primary/10 text-primary'
          )}
        >
          <Image src={imgUrl} fill alt={`${name} server image`} />
        </div>
      </button>
    </ActionTooltip>
  )
}
