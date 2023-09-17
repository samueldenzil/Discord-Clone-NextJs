import { NextApiRequest } from 'next'
import prisma from '@/lib/db'
import getCurrentUserPages from '@/lib/get-current-user-pages'
import { NextApiResponseServerIo } from '@/types'
import { MemberRole } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await getCurrentUserPages(req, res)
    const { channelId, serverId, messageId } = req.query
    const { content } = req.body

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!serverId) {
      return res.status(401).json({ error: 'ServerId Missing' })
    }

    if (!channelId) {
      return res.status(401).json({ error: 'ChannelId Missing' })
    }

    const server = await prisma.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        members: true,
      },
    })

    if (!server) {
      return res.status(404).json({ error: 'Server not found' })
    }

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    })

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' })
    }

    const member = server.members.find((member) => member.userId === user.id)

    if (!member) {
      return res.status(404).json({ error: 'Member not found' })
    }

    let message = await prisma.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!message || message.deleted) {
      return res.status(404).json({ error: 'Message not found' })
    }

    const isMessageOwner = message.memberId === member.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const canModify = isMessageOwner || isAdmin || isModerator

    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method === 'DELETE') {
      message = await prisma.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: 'This message has been deleted.',
          deleted: true,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      })
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      message = await prisma.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      })
    }

    const updateKey = `chat:${channelId}:messages:update`
    res.socket.server.io.emit(updateKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('[MESSAGE_ID]', error)
    return res.status(500).json({ error: 'Internal Error' })
  }
}
