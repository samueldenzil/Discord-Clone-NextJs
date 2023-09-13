import getCurrentUser from '@/lib/get-current-user'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }: { params: { serverId: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.serverId) {
      return new NextResponse('Server Id missing', { status: 400 })
    }

    const server = await prisma.server.update({
      where: {
        id: params.serverId,
        userId: {
          not: user.id,
        },
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            userId: user.id,
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error: any) {
    console.log('SERVER_LEAVE_POST ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
