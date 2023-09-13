import getCurrentUser from '@/lib/get-current-user'
import prisma from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: { channelId: string } }) {
  try {
    const user = await getCurrentUser()
    const { searchParams } = new URL(request.url)

    const serverId = searchParams.get('serverId')

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('ServerId missing', { status: 400 })
    }

    if (!params.channelId) {
      return new NextResponse('ChannelId missing', { status: 400 })
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId: user.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[CHANNEL_ID_DELETE] ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { channelId: string } }) {
  try {
    const user = await getCurrentUser()
    const { name, type } = await request.json()

    const { searchParams } = new URL(request.url)

    const serverId = searchParams.get('serverId')

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('ServerId missing', { status: 400 })
    }

    if (!params.channelId) {
      return new NextResponse('ChannelId missing', { status: 400 })
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId: user.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              name: {
                not: 'general',
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[CHANNEL_ID_DELETE] ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
