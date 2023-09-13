import { redirect } from 'next/navigation'

import getCurrentUser from '@/lib/get-current-user'
import prisma from '@/lib/db'
import { getOrCreateConversation } from '@/lib/conversation'
import { CloudFog } from 'lucide-react'
import ChatHeader from '@/components/chat/chat-header'

type MemberIdPageProps = {
  params: {
    serverId: string
    memberId: string
  }
}

export default async function MemberIdPage({ params }: MemberIdPageProps) {
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
    </div>
  )
}
