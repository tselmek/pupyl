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
        <footer>
          ©PUPYL 2023. Created with ❤️ and ✨ by <a href="https://github.com/tselmek">Antoine Jésus</a>.
        </footer>
      </body>
    </html>
  )
}
