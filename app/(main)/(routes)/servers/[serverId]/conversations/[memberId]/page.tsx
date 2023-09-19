import { redirect } from 'next/navigation'

import getCurrentUser from '@/lib/get-current-user'
import prisma from '@/lib/db'
import { getOrCreateConversation } from '@/lib/conversation'
import ChatHeader from '@/components/chat/chat-header'
import ChatMessages from '@/components/chat/chat-messages'
import ChatInput from '@/components/chat/chat-input'
import MediaRoom from '@/components/media-room'

type MemberIdPageProps = {
  params: {
    serverId: string
    memberId: string
  }
  searchParams: {
    video?: boolean
  }
}

export default async function MemberIdPage({ params, searchParams }: MemberIdPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }

  const currentMember = await prisma.member.findFirst({
    where: {
      serverId: params.serverId,
      userId: user.id,
    },
    include: {
      user: true,
    },
  })

  if (!currentMember) {
    redirect('/')
  }

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId)
  if (!conversation) {
    redirect(`/servers/${params.serverId}`)
  }

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.userId === user.id ? memberTwo : memberOne

  return (
    <div className="bg-white flex flex-col h-full dark:bg-[#313338]">
      <ChatHeader
        name={otherMember.user.name!}
        type="conversation"
        serverId={params.serverId}
        imageUrl={otherMember.user.image!}
      />

      {searchParams.video && (
        <MediaRoom chatId={conversation.id} audio={true} video={true} username={user.name ?? ''} />
      )}

      {!searchParams.video && (
        <>
          <ChatMessages
            name={otherMember.user.name ?? ''}
            member={currentMember}
            chatId={conversation.id}
            apiUrl="/api/direct-messages"
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
            paramKey="conversationId"
            paramValue={conversation.id}
            type={'conversation'}
          />
          <ChatInput
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
            name={otherMember.user.name ?? ''}
            type="conversation"
          />
        </>
      )}
    </div>
  )
}
