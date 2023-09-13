import getCurrentUser from '@/lib/get-current-user'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: { serverId: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.serverId) {
      return new NextResponse('Server Id missing', { status: 400 })
    }

    const server = await prisma.server.delete({
      where: {
        id: params.serverId,
        userId: user.id,
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.error('SeverId_DELETE_ERROR: ' + error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { serverId: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.serverId) {
      return new NextResponse('Server Id missing', { status: 400 })
    }

    const { name, imageUrl } = await request.json()

    const server = await prisma.server.update({
      where: {
        id: params.serverId,
        userId: user.id,
      },
      data: {
        name,
        imageUrl,
      },
    })

    return NextResponse.json(server)
  } catch (error: any) {
    console.error('SeverId PATCH Error: ' + error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
