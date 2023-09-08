import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import getCurrentUser from '@/actions/get-current-user'
import prisma from '@/lib/db'
import { MemberRole } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const { name, imageUrl } = await request.json()

    const currentUser = await getCurrentUser()
    console.log(currentUser?.email)
    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const server = await prisma.server.create({
      data: {
        userId: currentUser.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: 'general', userId: currentUser.id }],
        },
        members: {
          create: [{ userId: currentUser.id, role: MemberRole.ADMIN }],
        },
      },
    })

    return NextResponse.json(server)
  } catch (error: any) {
    console.error('Error Server POST: ' + error)
    return new NextResponse('Error Server POST: ' + error, { status: 500 })
  }
}
