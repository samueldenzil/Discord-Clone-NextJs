import { redirect } from 'next/navigation'

import prisma from '@/lib/db'
import getCurrentUser from '@/actions/get-current-user'
import { ScrollArea } from '../ui/scroll-area'
import ServerSection from './server-section'
import ServerMember from './server-member'

type ServerMembersSidebarProps = {
  serverId: string
}

export default async function ServerMembersSidebar({ serverId }: ServerMembersSidebarProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }

  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })

  if (!server) {
    redirect('/')
  }

  const members = server?.members.filter((member) => member.userId !== user.id)
  const role = server.members.find((member) => member.userId === user.id)?.role

  return (
    <div className="h-full w-full flex flex-col bg-[#f2f3f5] dark:bg-[#2b2d31] text-primary">
      <ScrollArea className="flex-1 px-3">
        <div className="my-2">
          <ServerSection sectionType="members" role={role} server={server} label="Members" />
          <div className="space-y-[2px]">
            {members.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
