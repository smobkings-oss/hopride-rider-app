'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Clock, Car, Trash2, Eye } from 'lucide-react'
import { format } from 'date-fns'

interface Ride {
  id: string
  pickup: string
  dropoff: string
  type: 'instant' | 'scheduled'
  vehicle?: 'hop' | 'navigator' | 'xl'
  scheduledFor?: string
  estimatedFare: number
  status: string
  createdAt: string
}

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('hopride-rides')
    if (stored) {
      setRides(JSON.parse(stored))
    }
  }, [])

  const clearRides = () => {
    if (confirm('Clear all ride history?')) {
      localStorage.removeItem('hopride-rides')
      setRides([])
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Rides</h1>
          <p className="text-gray-400">Your recent ride requests</p>
        </div>
        {rides.length > 0 && (
          <button
            onClick={clearRides}
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {rides.length === 0 ? (
        <div className="text-center py-20">
          <Car className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">No rides yet</p>
          <Link
            href="/book"
            className="inline-block bg-gold-500 text-black font-semibold px-6 py-3 rounded-full"
          >
            Book Your First Ride
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="bg-gray-900 border border-gray-800 hover:border-gold-600/40 rounded-xl p-5 transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {ride.type === 'instant' ? (
                    <span className="text-xs bg-gold-500/20 text-gold-400 px-2 py-1 rounded-full">Instant</span>
                  ) : (
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Scheduled</span>
                  )}
                  {ride.vehicle && (
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full capitalize">
                      {ride.vehicle === 'navigator' ? 'Tesla Nav' : ride.vehicle}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {format(new Date(ride.createdAt), 'MMM d, h:mm a')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    ride.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    ride.status === 'matched' || ride.status === 'enroute' ? 'bg-gold-500/20 text-gold-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {ride.status}
                  </span>
                </div>
                <span className="font-semibold text-gold-400">${ride.estimatedFare.toFixed(2)}</span>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                  <span className="truncate">{ride.pickup}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="truncate">{ride.dropoff}</span>
                </div>
                {ride.scheduledFor && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{format(new Date(ride.scheduledFor), 'PPP p')}</span>
                  </div>
                )}
              </div>
              {ride.type === 'instant' && ride.status !== 'completed' && (
                <Link
                  href={`/track?id=${ride.id}`}
                  className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300"
                >
                  <Eye className="w-3 h-3" /> Track
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
