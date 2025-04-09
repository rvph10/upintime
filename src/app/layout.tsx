import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '../components/layout/Navigation'

// Initialize Inter font
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UpInTime - App Development Studio',
  description: 'Professional app development studio specializing in modern, high-performance applications.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-background text-primary min-h-screen`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
} 