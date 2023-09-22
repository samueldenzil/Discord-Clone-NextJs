import { redirect } from 'next/navigation'

import prisma from '@/lib/db'
import getCurrentUser from '@/lib/get-current-user'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import NavigationAction from '@/components/navigation/navigation-action'
import NavigationItem from '@/components/navigation/navigation-item'
import { ModeToggle } from '@/components/mode-toggle'
import UserAvatar from '@/components/user-avatar'
// import { signOut } from 'next-auth/react'

export default async function NavigationSidebar() {
  const user = await getCurrentUser()

  const servers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          userId: user?.id,
        },
      },
    },
  })

  if (!user) {
    return redirect('/')
  }

  return (
    <div className="flex h-full w-full flex-col items-center space-y-4 bg-[#e3e5e8] py-3 text-primary dark:bg-[#1e1f22]">
      <NavigationAction />
      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />

      <ScrollArea className="w-full flex-1">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem id={server.id} name={server.name} imgUrl={server.imageUrl} />
          </div>
        ))}
      </ScrollArea>

      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ModeToggle />
        <UserAvatar
          src={user.image!}
          className="cursor-pointer md:h-11 md:w-11"
          onClick="signOut"
        />
      </div>
    </div>
  )
}
