import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PUPYL',
  description: 'Generate calssroom seating plans',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
