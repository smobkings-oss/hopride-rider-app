'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { MapPin, Car, Clock, CheckCircle, Loader2, Phone } from 'lucide-react'

interface Ride {
  id: string
  pickup: string
  dropoff: string
  type: string
  vehicle?: string
  estimatedFare: number
  status: string
  createdAt: string
}

const STATUS_STEPS = ['matched', 'enroute', 'arrived', 'inprogress', 'completed']

function TrackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')
  const [ride, setRide] = useState<Ride | null>(null)
  const [statusIndex, setStatusIndex] = useState(0)

  useEffect(() => {
    if (!id) return
    const rides = JSON.parse(localStorage.getItem('hopride-rides') || '[]')
    const found = rides.find((r: Ride) => r.id === id)
    setRide(found || null)
  }, [id])

  useEffect(() => {
    if (!ride || ride.status === 'completed') return
    const timer = setInterval(() => {
      setStatusIndex((prev) => {
        const next = prev + 1
        if (next >= STATUS_STEPS.length) {
          clearInterval(timer)
          const rides = JSON.parse(localStorage.getItem('hopride-rides') || '[]')
          const idx = rides.findIndex((r: Ride) => r.id === id)
          if (idx !== -1) {
            rides[idx].status = 'completed'
            localStorage.setItem('hopride-rides', JSON.stringify(rides))
            setRide({ ...rides[idx] })
          }
          return prev
        }
        const newStatus = STATUS_STEPS[next]
        const rides = JSON.parse(localStorage.getItem('hopride-rides') || '[]')
        const idx = rides.findIndex((r: Ride) => r.id === id)
        if (idx !== -1) {
          rides[idx].status = newStatus
          localStorage.setItem('hopride-rides', JSON.stringify(rides))
          setRide({ ...rides[idx] })
        }
        return next
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [ride, id])

  if (!ride) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-6">Ride not found</p>
        <button onClick={() => router.push('/rides')} className="text-gold-400">Back to rides</button>
      </div>
    )
  }

  const currentStatus = ride.status || 'matched'

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Tracking Your Ride</h1>
      <p className="text-gray-400 mb-8">Live simulation of driver progress</p>

      <div className="bg-gray-900 border border-gold-600/30 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gold-400 font-semibold capitalize">{currentStatus.replace('inprogress', 'In Progress')}</span>
          <span className="text-xl font-bold text-gold-400">${ride.estimatedFare.toFixed(2)}</span>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-gray-500">Pickup</div>
              {ride.pickup}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-gray-500">Dropoff</div>
              {ride.dropoff}
            </div>
          </div>
          {ride.vehicle && (
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-gold-500" />
              <span className="capitalize">{ride.vehicle === 'navigator' ? 'Tesla Navigator' : ride.vehicle}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {STATUS_STEPS.map((step, i) => {
          const active = STATUS_STEPS.indexOf(currentStatus) >= i || currentStatus === 'completed'
          return (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                active ? 'bg-gold-500 text-black' : 'bg-gray-800 text-gray-500'
              }`}>
                {active && i === STATUS_STEPS.indexOf(currentStatus) && currentStatus !== 'completed' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : active ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <span className={active ? 'text-white' : 'text-gray-500'}>
                {step === 'matched' && 'Driver matched'}
                {step === 'enroute' && 'Driver en route'}
                {step === 'arrived' && 'Driver arrived'}
                {step === 'inprogress' && 'Trip in progress'}
                {step === 'completed' && 'Trip completed'}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-700 rounded-xl text-gray-300">
          <Phone className="w-4 h-4" /> Contact Driver
        </button>
        <button
          onClick={() => router.push('/rides')}
          className="flex-1 py-3 bg-gold-500 text-black font-semibold rounded-xl"
        >
          Done
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-6 text-center">
        This is a simulated tracking experience. Real-time GPS tracking will use Supabase Realtime + Maps.
      </p>
    </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto px-4 py-20 text-center text-gray-400">Loading tracking...</div>}>
      <TrackContent />
    </Suspense>
  )
}