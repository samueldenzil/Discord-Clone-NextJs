import { redirect } from 'next/navigation'

import getCurrentUser from '@/lib/get-current-user'
import prisma from '@/lib/db'
import ChatHeader from '@/components/chat/chat-header'
import ChatInput from '@/components/chat/chat-input'

type ChannelIdPageProps = {
  params: {
    serverId: string
    channelId: string
  }
}

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const channel = await prisma.channel.findUnique({
    where: {
      id: params.channelId,
    },
  })

  const member = await prisma.member.findFirst({
    where: {
      serverId: params.serverId,
      userId: user.id,
    },
  })

  if (!channel || !member) {
    redirect('/')
  }

  return (
    <div className="bg-white flex flex-col h-full dark:bg-[#313338]">
      <ChatHeader name={channel.name} serverId={params.serverId} type="channel" />
      <div className="flex-1">future message</div>
      <ChatInput
        apiUrl="/api/socket/messages"
        name={channel.name}
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
        type="channel"
      />
    </div>
  )
}
