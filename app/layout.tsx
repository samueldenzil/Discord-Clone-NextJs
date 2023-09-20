import './globals.css'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'

import { AuthProvider } from '@/components/providers/auth-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ModalProvider } from '@/components/providers/modal-provider'
import { SocketProvider } from '@/components/providers/socket-provider'
import { QueryProvider } from '@/components/providers/query-provider'

import { cn } from '@/lib/utils'

const openSans = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Discord Clone',
  description:
    'A Fullstack Discord Clone with Next.js 13, React, Socket.io, Prisma, Tailwind, PostgreSQL. This project is developed by Denzil Samuel samueldenzil.',
  icons: {
    icon: '/assets/discord-icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(openSans.className, 'bg-white dark:bg-[#313338]')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="discord-theme"
        >
          <SocketProvider>
            <AuthProvider>
              <ModalProvider />
              <QueryProvider>
                <ToastProvider />
                {children}
              </QueryProvider>
            </AuthProvider>
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
