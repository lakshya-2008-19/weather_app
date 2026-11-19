import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { REGIONS, searchPlaces } from '../lib/weather.js'

export default function RegionPicker({ region, onChange }) {
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
    setGeoMsg('Locating signal…')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoMsg('')
        pick({ name: 'My location', country: '', lat: pos.coords.latitude, lon: pos.coords.longitude })
      },
      () => setGeoMsg('Could not get your location. Try searching instead.'),
      { timeout: 8000 },
    )
  }

  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-cyan-300/80">{'>'} Select sector</p>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any city…"
          aria-label="Search for a city"
          className="w-full border border-cyan-400/60 bg-black/50 px-3 py-2.5 text-sm uppercase tracking-wider text-cyan-100 placeholder-cyan-300/40 outline-none focus:border-pink-400 focus:shadow-[0_0_14px_rgba(236,72,153,0.6)]"
        />
        {busy && <span className="absolute right-3 top-2.5 animate-pulse text-sm text-pink-400">SCAN…</span>}
        {results.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full border border-pink-400 bg-[#0a0420] shadow-[0_0_24px_rgba(236,72,153,0.5)]">
            {results.map((r, i) => (
              <li key={`${r.lat}-${r.lon}-${i}`}>
                <button
                  type="button"
                  onClick={() => pick(r)}
                  className="flex w-full flex-col px-3 py-2 text-left hover:bg-pink-500/20"
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-white">{r.name}</span>
                  <span className="text-xs text-cyan-300/70">{[r.admin, r.country].filter(Boolean).join(', ')}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={locate}
        className="mt-2 text-xs uppercase tracking-widest text-pink-300 underline decoration-pink-400 underline-offset-4 hover:text-pink-200"
      >
        ◉ Use my location
      </button>
      {geoMsg && <p className="mt-1 text-xs text-cyan-200/80">{geoMsg}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {REGIONS.map((r) => {
          const active = r.name === region.name && r.lat === region.lat
          return (
            <motion.button
              key={r.name}
              type="button"
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -2 }}
              onClick={() => pick(r)}
              className={`border px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors ${
                active
                  ? 'border-pink-400 bg-pink-500/30 text-white shadow-[0_0_14px_rgba(236,72,153,0.7)]'
                  : 'border-cyan-400/50 bg-cyan-400/5 text-cyan-200 hover:bg-cyan-400/20'
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
