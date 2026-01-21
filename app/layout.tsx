import type { Metadata } from 'next'
import { QueryProvider } from '@/providers/query-provider'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'warpSpeed AI Chat',
  description: 'AI Powered Chat Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
