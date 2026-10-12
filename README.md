# HopRide Rider App

Premium local ride-hailing for NW Ohio. Riders can hop on and place **instant** or **scheduled** ride orders in seconds.

## Features
- Instant ride requests with simulated driver matching
- Scheduled rides (date + time picker)
- Vehicle options: Hop (standard), Tesla Navigator, Hop XL
- Realistic fare estimates (base + distance + time + vehicle multiplier)
- Current location button for pickup
- Ride history (local demo storage)
- Black & gold holographic branding aligned with A2B Rides

## Tech Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Ready for Capacitor (iOS/Android), Supabase (auth + realtime + DB), Stripe (payments), Mapbox/Google Maps

## Local Development
```bash
npm install
npm run dev
```

## Deploy
Deploy to Vercel. Connect the GitHub repo for automatic deploys.

## Next Steps (per platform roadmap)
1. Supabase Auth (rider login)
2. Realtime driver matching & location tracking
3. Stripe Checkout + Connect for payments & driver payouts
4. Map integration
5. Admin dashboard
6. Capacitor mobile builds

Built for the A2B Rides / HopRide NW Ohio launch.
