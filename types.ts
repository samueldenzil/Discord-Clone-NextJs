import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as ServerIOServer } from 'socket.io'
import { Member, Server, User } from '@prisma/client'

export type ServerWithMembersWithUsers = Server & {
  members: (Member & {
    user: User
  })[]
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIOServer
    }
  }
}
