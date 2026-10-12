'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { MapPin, Clock, Zap, Calculator, CheckCircle, Car, Navigation, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

type RideType = 'instant' | 'scheduled'
type VehicleType = 'hop' | 'navigator' | 'xl'

interface Ride {
  id: string
  pickup: string
  dropoff: string
  type: RideType
  vehicle: VehicleType
  scheduledFor?: string
  estimatedFare: number
  status: 'requested' | 'matching' | 'matched' | 'confirmed'
  createdAt: string
}

const VEHICLES = {
  hop: { name: 'Hop', multiplier: 1, description: 'Standard sedan' },
  navigator: { name: 'Tesla Navigator', multiplier: 1.25, description: 'Premium Tesla Model 3' },
  xl: { name: 'Hop XL', multiplier: 1.5, description: 'Larger vehicle' },
}

function calculateFare(pickup: string, dropoff: string, vehicle: VehicleType, type: RideType): number {
  // More realistic mock based on the skill's pricing intent
  const base = 3.50
  const perMile = 1.85
  const perMin = 0.28
  const booking = 1.50
  // Mock distance/time from string length (rough estimate for demo)
  const dist = Math.max(3, Math.min(25, (pickup.length + dropoff.length) / 4))
  const time = dist * 2.5 // minutes
  let fare = base + dist * perMile + time * perMin + booking
  fare *= VEHICLES[vehicle].multiplier
  if (type === 'scheduled') fare += 1
  fare = Math.max(fare, 8)
  return Math.round(fare * 100) / 100
}

export default function BookPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialType = (searchParams.get('type') as RideType) || 'instant'

  const [type, setType] = useState<RideType>(initialType)
  const [vehicle, setVehicle] = useState<VehicleType>('hop')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [fare, setFare] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [matching, setMatching] = useState(false)
  const [lastRide, setLastRide] = useState<Ride | null>(null)

  useEffect(() => {
    if (pickup && dropoff) {
      setFare(calculateFare(pickup, dropoff, vehicle, type))
    } else {
      setFare(null)
    }
  }, [pickup, dropoff, vehicle, type])

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPickup(`Current Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`)
        },
        () => setPickup('Current Location (NW Ohio)')
      )
    } else {
      setPickup('Current Location')
    }
  }

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
      vehicle,
      scheduledFor: type === 'scheduled' ? `${scheduledDate}T${scheduledTime}` : undefined,
      estimatedFare: fare || 0,
      status: 'requested',
      createdAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem('hopride-rides') || '[]')
    existing.unshift(ride)
    localStorage.setItem('hopride-rides', JSON.stringify(existing.slice(0, 20)))

    setLastRide(ride)
    setSubmitting(false)
    setMatching(true)

    // Simulate matching for instant rides
    if (type === 'instant') {
      setTimeout(() => {
        setMatching(false)
        setSuccess(true)
        // Update status in storage
        const updated = JSON.parse(localStorage.getItem('hopride-rides') || '[]')
        const idx = updated.findIndex((r: Ride) => r.id === ride.id)
        if (idx !== -1) {
          updated[idx].status = 'matched'
          localStorage.setItem('hopride-rides', JSON.stringify(updated))
        }
      }, 2500)
    } else {
      setMatching(false)
      setSuccess(true)
    }
  }

  if (matching) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Loader2 className="w-16 h-16 text-gold-500 mx-auto mb-6 animate-spin" />
        <h1 className="text-3xl font-bold mb-2">Finding your driver...</h1>
        <p className="text-gray-400">Matching with a nearby HopRide driver in NW Ohio.</p>
      </div>
    )
  }

  if (success && lastRide) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-gold-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">
          {lastRide.type === 'instant' ? 'Driver Matched!' : 'Ride Scheduled!'}
        </h1>
        <p className="text-gray-400 mb-6">
          {lastRide.type === 'instant' 
            ? 'Your HopRide driver is on the way. Live tracking coming soon.' 
            : 'You\'ll receive a reminder before your scheduled pickup.'}
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
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Car className="w-4 h-4 text-gold-500" />
            {VEHICLES[lastRide.vehicle].name}
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
            onClick={() => { setSuccess(false); setMatching(false); }}
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
      <p className="text-gray-400 mb-8">Enter pickup and dropoff. Instant or schedule for later. NW Ohio focused.</p>

      <div className="flex gap-2 mb-6 p-1 bg-gray-900 rounded-full w-fit">
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

      <div className="mb-8">
        <label className="block text-sm text-gray-400 mb-2">Vehicle</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(VEHICLES) as VehicleType[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVehicle(v)}
              className={`p-3 rounded-xl border text-sm transition ${
                vehicle === v 
                  ? 'border-gold-500 bg-gold-500/10 text-gold-400' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="font-medium">{VEHICLES[v].name}</div>
              <div className="text-xs text-gray-500 mt-1">{VEHICLES[v].description}</div>
            </button>
          ))}
        </div>
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
              className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500 rounded-xl pl-11 pr-12 py-3 outline-none"
              required
            />
            <button
              type="button"
              onClick={useCurrentLocation}
              className="absolute right-3 top-3 text-gold-400 hover:text-gold-300"
              title="Use current location"
            >
              <Navigation className="w-5 h-5" />
            </button>
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
        Demo mode: Rides saved locally. Ready for Supabase realtime matching, Stripe payments, and live tracking.
      </p>
    </div>
  )
}
