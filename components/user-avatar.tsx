import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type UserAvatarProps = {
  src?: string
  className?: string
}

export default function UserAvatar({ src, className }: UserAvatarProps) {
  return (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarImage src={src} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
