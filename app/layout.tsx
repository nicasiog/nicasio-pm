import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Portfolio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
