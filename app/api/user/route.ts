import prisma from '@/lib/db'
import getCurrentUser from '@/lib/get-current-user'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try {
    let user = await getCurrentUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name, image } = await request.json()

    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        image,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('[USERID_PATCH_ERROR]: ' + error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
