import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import { AuthProvider } from '@/components/organisms/AuthProvider'
import { SupabaseProvider } from '@/components/organisms/SupabaseProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Digital Invites',
  description: 'Erstelle und verwalte digitale Einladungen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <SupabaseProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
