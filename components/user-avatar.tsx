'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

type UserAvatarProps = {
  src?: string
  className?: string
  onClick?: 'signOut'
}

export default function UserAvatar({ src, className, onClick }: UserAvatarProps) {
  const handleOnClick = () => {
    if (onClick === 'signOut') {
      signOut()
    }
  }

  return (
    <Avatar onClick={handleOnClick} className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarImage src={src} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
