import { NextResponse } from 'next/server'

import prisma from '@/lib/db'
import getCurrentUser from '@/lib/get-current-user'
import { Message } from '@prisma/client'

const MESSAGES_BATCH = 10

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    const { searchParams } = new URL(request.url)

    const cursor = searchParams.get('cursor')
    const channelId = searchParams.get('channelId')

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!channelId) {
      return new NextResponse('ChannelId missing', { status: 400 })
    }

    let messages: Message[] = []

    if (cursor) {
      messages = await prisma.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      messages = await prisma.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    let nextCursor = null
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id
    }

    return NextResponse.json({ items: messages, nextCursor })
  } catch (error) {
    console.log('[MESSAGES_GET] ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
