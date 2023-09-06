import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import prisma from '@/lib/db'
import getCurrentUser from '@/actions/getCurrentUser'

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
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
        userId: user.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    })

    return NextResponse.json(server)
  } catch (error: any) {
    console.error('SeverId PATCH Error: ' + error)
    return new NextResponse('SeverId PATCH Error', { status: 500 })
  }
}
