import getCurrentUser from '@/actions/get-current-user'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'

type ServerIdPageProps = {
  params: {
    serverId: string
  }
}

export default async function ServerIdPage({ params }: ServerIdPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const server = await prisma.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== 'general') {
    return null
  }

  return redirect(`/servers/${server?.id}/channels/${initialChannel.id}`)
}
