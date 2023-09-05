import getServer from '@/actions/getServer'
import InitialModal from '@/components/modals/initial-modal'
import { redirect } from 'next/navigation'

export default async function Home() {
  const server = await getServer()

  if (server) {
    redirect(`/servers/${server.id}`)
  }

  return <InitialModal />
}
