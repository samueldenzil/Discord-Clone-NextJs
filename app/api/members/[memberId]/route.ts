import getCurrentUser from '@/lib/get-current-user'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: { memberId: string } }) {
  try {
    const user = await getCurrentUser()
    const { searchParams } = new URL(request.url)

    const serverId = searchParams.get('serverId')
    if (!serverId) {
      return new NextResponse('Server Id missing', { status: 400 })
    }

    if (!params.memberId) {
      return new NextResponse('Member Id missing', { status: 400 })
    }

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        userId: user.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            userId: {
              not: user.id,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server)
  } catch (error: any) {
    console.error('[MEMBERS_ID_DELETE] ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { memberId: string } }) {
  try {
    const user = await getCurrentUser()
    const { searchParams } = new URL(request.url)
    const { role } = await request.json()

    const serverId = searchParams.get('serverId')
    if (!serverId) {
      return new NextResponse('Server Id missing', { status: 400 })
    }

    if (!params.memberId) {
      return new NextResponse('Member Id missing', { status: 400 })
    }

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        userId: user.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              userId: {
                not: user.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
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

    return NextResponse.json(server)
  } catch (error: any) {
    console.error('[MEMBERS_ID_PATCH] ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
