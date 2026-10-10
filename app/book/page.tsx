'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { MapPin, Clock, Zap, Calculator, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

type RideType = 'instant' | 'scheduled'

interface Ride {
  id: string
  pickup: string
  dropoff: string
  type: RideType
  scheduledFor?: string
  estimatedFare: number
  status: 'requested' | 'confirmed'
  createdAt: string
}

function calculateFare(pickup: string, dropoff: string): number {
  // Simple mock: base + length-based estimate
  const base = 4.5
  const perChar = 0.15
  const length = Math.max(pickup.length + dropoff.length, 20)
  return Math.round((base + length * perChar) * 100) / 100
}

export default function BookPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialType = (searchParams.get('type') as RideType) || 'instant'

  const [type, setType] = useState<RideType>(initialType)
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [fare, setFare] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [lastRide, setLastRide] = useState<Ride | null>(null)

  useEffect(() => {
    if (pickup && dropoff) {
      setFare(calculateFare(pickup, dropoff))
    } else {
      setFare(null)
    }
  }, [pickup, dropoff])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !dropoff) return
    if (type === 'scheduled' && (!scheduledDate || !scheduledTime)) return

    setSubmitting(true)

    const ride: Ride = {
      id: crypto.randomUUID(),
      pickup,
      dropoff,
      type,
      scheduledFor: type === 'scheduled' ? `${scheduledDate}T${scheduledTime}` : undefined,
      estimatedFare: fare || 0,
      status: 'requested',
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage for demo
    const existing = JSON.parse(localStorage.getItem('hopride-rides') || '[]')
    existing.unshift(ride)
    localStorage.setItem('hopride-rides', JSON.stringify(existing.slice(0, 20)))

    setLastRide(ride)
    setSuccess(true)
    setSubmitting(false)

    // Reset form after a moment
    setTimeout(() => {
      setPickup('')
      setDropoff('')
      setScheduledDate('')
      setScheduledTime('')
      setFare(null)
    }, 100)
  }

  if (success && lastRide) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-gold-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Ride Requested!</h1>
        <p className="text-gray-400 mb-6">
          {lastRide.type === 'instant' ? 'Looking for a nearby driver...' : 'Scheduled ride confirmed.'}
        </p>
        <div className="bg-gray-900 border border-gold-600/30 rounded-xl p-6 text-left space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gold-500 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">Pickup</div>
              <div>{lastRide.pickup}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gold-400 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">Dropoff</div>
              <div>{lastRide.dropoff}</div>
            </div>
          </div>
          {lastRide.scheduledFor && (
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold-500 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500">Scheduled</div>
                <div>{format(new Date(lastRide.scheduledFor), 'PPP p')}</div>
              </div>
            </div>
          )}
          <div className="pt-3 border-t border-gray-800 text-xl font-semibold text-gold-400">
            Est. ${lastRide.estimatedFare.toFixed(2)}
          </div>
        </div>
        <div className="mt-8 flex gap-3 justify-center">
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-3 bg-gold-500 text-black font-semibold rounded-full"
          >
            Book Another
          </button>
          <button
            onClick={() => router.push('/rides')}
            className="px-6 py-3 border border-gold-500 text-gold-400 rounded-full"
          >
            View My Rides
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Book a Ride</h1>
      <p className="text-gray-400 mb-8">Enter pickup and dropoff. Instant or schedule for later.</p>

      <div className="flex gap-2 mb-8 p-1 bg-gray-900 rounded-full w-fit">
        <button
          onClick={() => setType('instant')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition ${
            type === 'instant' ? 'bg-gold-500 text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" /> Instant
        </button>
        <button
          onClick={() => setType('scheduled')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition ${
            type === 'scheduled' ? 'bg-gold-500 text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" /> Scheduled
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Pickup Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gold-500" />
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="e.g. 123 Main St, Toledo, OH"
              className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500 rounded-xl pl-11 pr-4 py-3 outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Dropoff Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gold-400" />
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="e.g. Toledo Express Airport"
              className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500 rounded-xl pl-11 pr-4 py-3 outline-none"
              required
            />
          </div>
        </div>

        {type === 'scheduled' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500 rounded-xl px-4 py-3 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500 rounded-xl px-4 py-3 outline-none"
                required
              />
            </div>
          </div>
        )}

        {fare !== null && (
          <div className="bg-gray-900 border border-gold-600/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-gold-500" />
              <span className="text-gray-300">Estimated Fare</span>
            </div>
            <span className="text-2xl font-bold text-gold-400">${fare.toFixed(2)}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !pickup || !dropoff || (type === 'scheduled' && (!scheduledDate || !scheduledTime))}
          className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl text-lg transition"
        >
          {submitting ? 'Requesting...' : type === 'instant' ? 'Request Instant Ride' : 'Schedule Ride'}
        </button>
      </form>

      <p className="text-xs text-gray-600 mt-6 text-center">
        Demo mode: Rides are saved locally. Connect Supabase for real matching, payments, and tracking.
      </p>
    </div>
  )
}
