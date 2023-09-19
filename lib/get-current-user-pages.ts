import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/db'
import { NextApiResponseServerIo } from '@/types'
import { NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'

const getCurrentUserPages = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  try {
    const session = await getServerSession(req, res, authOptions)

    console.log('session = ', session)

    if (!session?.user?.email) {
      return null
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!currentUser) {
      return null
    }
    return currentUser
  } catch (error: any) {
    return null
  }
}

export default getCurrentUserPages
