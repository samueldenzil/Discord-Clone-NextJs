import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'

import { NextApiResponseServerIo } from '@/types'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')

    const path = '/api/socket/io'
    const httpServer: NetServer = res.socket.server as any

    const io = new ServerIO(httpServer, {
      path: path,
      // @ts-ignore
      addTrailingSlash: false,
    })

    res.socket.server.io = io
  }
  res.end()
}
