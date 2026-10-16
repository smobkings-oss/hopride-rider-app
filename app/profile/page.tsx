'use client'

import { useState, useEffect } from 'react'
import { User, Phone, Home, Briefcase, Save } from 'lucide-react'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [home, setHome] = useState('')
  const [work, setWork] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('hopride-profile') || '{}')
    const places = JSON.parse(localStorage.getItem('hopride-places') || '{}')
    setName(profile.name || '')
    setPhone(profile.phone || '')
    setHome(places.home || '')
    setWork(places.work || '')
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('hopride-profile', JSON.stringify({ name, phone }))
    localStorage.setItem('hopride-places', JSON.stringify({ home, work }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
      <p className="text-gray-400 mb-8">Save your details and favorite places for faster booking.</p>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
            <User className="w-4 h-4" /> Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500 rounded-xl px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
            <Phone className="w-4 h-4" /> Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(419) 555-0123"
            className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500 rounded-xl px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
            <Home className="w-4 h-4" /> Home Address
          </label>
          <input
            type="text"
            value={home}
            onChange={(e) => setHome(e.target.value)}
            placeholder="123 Home St, Toledo, OH"
            className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500 rounded-xl px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Work Address
          </label>
          <input
            type="text"
            value={work}
            onChange={(e) => setWork(e.target.value)}
            placeholder="456 Work Ave, Perrysburg, OH"
            className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500 rounded-xl px-4 py-3 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saved ? 'Saved!' : 'Save Profile'}
        </button>
      </form>

      <p className="text-xs text-gray-600 mt-6 text-center">
        Profile data is stored locally in this demo. Connect Supabase Auth for real accounts.
      </p>
    </div>
  )
}
