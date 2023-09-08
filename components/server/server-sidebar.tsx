import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'

import getCurrentUser from '@/actions/get-current-user'
import prisma from '@/lib/db'
import ServerHeader from '@/components/server/server-header'

type ServerSidebarProps = {
  serverId: string
}

export default async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }

  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
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

  const textChannels = server.channels.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = server.channels.filter((channel) => channel.type === ChannelType.AUDIO)
  const videoChannels = server.channels.filter((channel) => channel.type === ChannelType.VIDEO)
  const members = server.members.filter((member) => member.id !== user.id)

  const role = server.members.find((member) => member.userId === user.id)?.role

  return (
    <div className="h-full w-full flex flex-col bg-[#f2f3f5] dark:bg-[#2b2d31] text-primary">
      <ServerHeader server={server} role={role} />
    </div>
  )
}
