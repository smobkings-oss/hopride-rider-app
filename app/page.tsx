import Link from 'next/link'
import { ArrowRight, Clock, Zap, Shield, MapPin } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
          <span className="holographic">Hop On.</span><br />
          Instant or Scheduled.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Premium rides across NW Ohio & SE Michigan. Transparent pricing. Better pay for drivers. Book in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-8 py-4 rounded-full text-lg transition"
          >
            Book Instant Ride <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/book?type=scheduled"
            className="inline-flex items-center justify-center gap-2 border border-gold-500 text-gold-400 hover:bg-gold-500/10 font-semibold px-8 py-4 rounded-full text-lg transition"
          >
            Schedule Ahead
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="bg-gray-900/60 border border-gold-600/20 rounded-2xl p-6">
            <Zap className="w-8 h-8 text-gold-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Instant Rides</h3>
            <p className="text-gray-400">Get matched with a nearby driver in minutes. Live tracking simulation included.</p>
          </div>
          <div className="bg-gray-900/60 border border-gold-600/20 rounded-2xl p-6">
            <Clock className="w-8 h-8 text-gold-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Scheduled Rides</h3>
            <p className="text-gray-400">Book hours or days ahead for airports, events, or reliable pickups.</p>
          </div>
          <div className="bg-gray-900/60 border border-gold-600/20 rounded-2xl p-6">
            <Shield className="w-8 h-8 text-gold-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Local & Transparent</h3>
            <p className="text-gray-400">NW Ohio focused. Clear pricing. Driver-first platform with Tesla Navigator options.</p>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4" /> Serving Toledo, Perrysburg, Findlay, Fremont, Tiffin & surrounding areas
        </div>
      </div>
    </div>
  )
}