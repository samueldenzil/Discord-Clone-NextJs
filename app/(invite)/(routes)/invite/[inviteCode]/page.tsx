import { redirect } from 'next/navigation'

import getCurrentUser from '@/actions/getCurrentUser'
import prisma from '@/lib/db'

type InviteCodePageProps = {
  params: {
    inviteCode: string
  }
}

export default async function InviteCodePage({ params }: InviteCodePageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (!params.inviteCode) {
    redirect('/')
  }

  const existingServer = await prisma.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  })

  if (existingServer) {
    redirect(`/servers/${existingServer.id}`)
  }

  const server = await prisma.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: {
          userId: user.id,
        },
      },
    },
  })

  if (server) {
    redirect(`/servers/${server.id}`)
  }

  return null
}
