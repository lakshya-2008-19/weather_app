import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { REGIONS, searchPlaces } from '../lib/weather.js'

export default function RegionPicker({ region, onChange, dark }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [busy, setBusy] = useState(false)
  const [geoMsg, setGeoMsg] = useState('')
  const timer = useRef()

  useEffect(() => {
    clearTimeout(timer.current)
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    const ctrl = new AbortController()
    timer.current = setTimeout(async () => {
      setBusy(true)
      try {
        setResults(await searchPlaces(query.trim(), ctrl.signal))
      } catch (e) {
        if (e.name !== 'AbortError') setResults([])
      } finally {
        setBusy(false)
      }
    }, 350)
    return () => {
      clearTimeout(timer.current)
      ctrl.abort()
    }
  }, [query])

  const pick = (r) => {
    onChange(r)
    setQuery('')
    setResults([])
  }

  const locate = () => {
    if (!navigator.geolocation) return setGeoMsg('Location is not supported here.')
    setGeoMsg('Finding you…')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoMsg('')
        pick({ name: 'My location', country: '', lat: pos.coords.latitude, lon: pos.coords.longitude })
      },
      () => setGeoMsg('Could not get your location. Try searching instead.'),
      { timeout: 8000 },
    )
  }

  const input = dark
    ? 'bg-white/10 text-white placeholder-white/50 border-white/20'
    : 'bg-white/80 text-slate-800 placeholder-slate-400 border-white'

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest opacity-70">Choose region</p>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any city…"
          aria-label="Search for a city"
          className={`w-full rounded-2xl border px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-pink-400 ${input}`}
        />
        {busy && <span className="absolute right-3 top-2.5 animate-spin text-sm">🌸</span>}
        {results.length > 0 && (
          <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl">
            {results.map((r, i) => (
              <li key={`${r.lat}-${r.lon}-${i}`}>
                <button
                  type="button"
                  onClick={() => pick(r)}
                  className="flex w-full flex-col px-4 py-2 text-left hover:bg-pink-50"
                >
                  <span className="text-sm font-black">{r.name}</span>
                  <span className="text-xs text-slate-500">
                    {[r.admin, r.country].filter(Boolean).join(', ')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={locate}
        className="mt-2 text-xs font-black underline decoration-pink-400 decoration-2 underline-offset-4"
      >
        📍 Use my location
      </button>
      {geoMsg && <p className="mt-1 text-xs opacity-80">{geoMsg}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {REGIONS.map((r) => {
          const active = r.name === region.name && r.lat === region.lat
          return (
            <motion.button
              key={r.name}
              type="button"
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
              onClick={() => pick(r)}
              className={`rounded-full px-3 py-1 text-xs font-black transition-colors ${
                active
                  ? 'bg-pink-500 text-white shadow-md'
                  : dark
                    ? 'bg-white/15 hover:bg-white/25'
                    : 'bg-white/80 hover:bg-white'
              }`}
            >
              {r.name}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
