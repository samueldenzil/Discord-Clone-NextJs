import { NextResponse } from 'next/server'
import getCurrentUser from '@/actions/get-current-user'
import prisma from '@/lib/db'
import { MemberRole } from '@prisma/client'

export async function POST(request: Request) {
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

    if (name === 'general') {
      return new NextResponse('Channel name cannot be "general"', { status: 400 })
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
          create: {
            userId: user.id,
            name,
            type,
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error: any) {
    console.log('CHANNELS_POST: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
