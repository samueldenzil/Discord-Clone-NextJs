import { redirect } from 'next/navigation'

import prisma from '@/lib/db'

import getCurrentUser from '@/lib/get-current-user'
import ServerSidebar from '@/components/server/server-sidebar'
import ServerMembersSidebar from '@/components/server/server-members-sidebar'

export default async function ServerIdLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { serverId: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const server = await prisma.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: { userId: user.id },
      },
    },
  })

  if (!server) {
    return redirect('/')
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="md:pl-60 md:pr-60 h-full">{children}</main>
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed right-0 inset-y-0">
        <ServerMembersSidebar serverId={params.serverId} />
      </div>
    </div>
  )
}
