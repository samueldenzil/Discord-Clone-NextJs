import { NextResponse } from 'next/server'

import prisma from '@/lib/db'
import getCurrentUser from '@/lib/get-current-user'
import { DirectMessage, Message } from '@prisma/client'

const MESSAGES_BATCH = 10

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    const { searchParams } = new URL(request.url)

    const cursor = searchParams.get('cursor')
    const conversationId = searchParams.get('conversationId')

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!conversationId) {
      return new NextResponse('ConversationId missing', { status: 400 })
    }

    let messages: DirectMessage[] = []

    if (cursor) {
      messages = await prisma.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
      messages = await prisma.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
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
    console.log('[DIRECT_MESSAGES_GET] ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
