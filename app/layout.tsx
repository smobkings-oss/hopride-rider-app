import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Car, History } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HopRide | Instant & Scheduled Rides',
  description: 'Premium rides in NW Ohio. Book instantly or schedule ahead. Better for drivers, better for you.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b border-gold-600/30 bg-black/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Car className="w-7 h-7 text-gold-500" />
              <span className="text-xl font-bold holographic">HopRide</span>
            </Link>
            <div className="flex gap-6 text-sm">
              <Link href="/book" className="flex items-center gap-1 hover:text-gold-400 transition">
                <Car className="w-4 h-4" /> Book
              </Link>
              <Link href="/rides" className="flex items-center gap-1 hover:text-gold-400 transition">
                <History className="w-4 h-4" /> My Rides
              </Link>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-gold-600/20 py-6 text-center text-xs text-gray-500">
          HopRide / A2B Rides · NW Ohio · Premium local rides
        </footer>
      </body>
    </html>
  )
}
