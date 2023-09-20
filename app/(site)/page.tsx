import getServer from '@/lib/get-server'
import InitialModal from '@/components/modals/initial-modal'
import { redirect } from 'next/navigation'
import getCurrentUser from '@/lib/get-current-user'

export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const server = await getServer()

  if (server) {
    redirect(`/servers/${server.id}`)
  }

  return <InitialModal />
}
