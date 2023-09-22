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
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60 md:pr-60">{children}</main>
      <div className="fixed inset-y-0 right-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerMembersSidebar serverId={params.serverId} />
      </div>
    </div>
  )
}
