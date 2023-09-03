import prisma from '@/lib/db'
import getCurrentUser from './getCurrentUser'

const getServer = async () => {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return null
    }

    const server = await prisma.server.findFirst({
      where: {
        members: {
          some: {
            userId: currentUser.id,
          },
        },
      },
    })

    return server
  } catch (error: any) {
    return null
  }
}

export default getServer
