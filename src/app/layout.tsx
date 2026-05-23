import type { Metadata } from 'next'
import './globals.css'
import ModalProvider from '@/providers/modal-provider'
import { Toaster } from '@/components/ui/sonner'
import NextAuthProvider from '@/providers/next-auth-provider'
import { AuthProvider } from '@/providers/auth-provider'

export const metadata: Metadata = {
  title: 'LoftCommunity - Employment & Hiring Platform',
  description: 'Find your dream job or hire top talent. Skill-first matching for transparent, efficient hiring.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">
        <NextAuthProvider>
          <ModalProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ModalProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
