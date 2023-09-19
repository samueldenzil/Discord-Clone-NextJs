import { redirect } from 'next/navigation'
import { ChannelType } from '@prisma/client'

import getCurrentUser from '@/lib/get-current-user'
import prisma from '@/lib/db'
import ChatHeader from '@/components/chat/chat-header'
import ChatInput from '@/components/chat/chat-input'
import ChatMessages from '@/components/chat/chat-messages'
import MediaRoom from '@/components/media-room'

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
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            name={channel.name}
            member={member}
            chatId={channel.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
            type="channel"
          />
          <ChatInput
            apiUrl="/api/socket/messages"
            name={channel.name}
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            type="channel"
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} audio={true} video={false} username={user.name ?? ''} />
      )}

      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} audio={true} video={true} username={user.name ?? ''} />
      )}
    </div>
  )
}
