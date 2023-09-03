'use client'
import { ModeToggle } from '@/components/mode-toggle'
import { signOut } from 'next-auth/react'

export default function DashboardPage() {
  return (
    <div>
      DashboardPage
      <button onClick={() => signOut()}>sign out</button>
      <div>
        <ModeToggle />
      </div>
    </div>
  )
}
