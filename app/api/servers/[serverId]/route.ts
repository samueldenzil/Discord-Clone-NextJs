import getCurrentUser from '@/actions/getCurrentUser'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

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
    return new NextResponse('SeverId PATCH Error', { status: 500 })
  }
}
