import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Background from './components/Background.jsx'
import Miko from './components/Miko.jsx'
import Clock from './components/Clock.jsx'
import RegionPicker from './components/RegionPicker.jsx'
import CyberCard from './components/CyberCard.jsx'
import { REGIONS, describeCode, fetchWeather } from './lib/weather.js'
import { buildScan } from './lib/cyber.js'

const GREETINGS = ['Hi!', 'こんにちは!', 'Namaste!', 'Hola!', 'Bonjour!', '안녕!', 'Hello~']

const QUIPS = {
  clear: ['Skies are clean. Neon looks great!', 'All systems sunny!'],
  cloudy: ['Cloud cover detected. Stay sharp.', 'Overcast, but my circuits glow.'],
  fog: ['Visibility low. Stay close, okay?', 'Smog level: mysterious.'],
  rain: ['Share my umbrella?', 'Acid rain? Nope, just rain!'],
  snow: ['Cryo mode on. Cocoa time!', 'Snow in the neon city, so pretty!'],
  storm: ['Eek! That thunder was loud!', 'Stay inside, runner!'],
}

// per-weather accent colour that tints every panel
const ACCENT = {
  clear: '#22d3ee',
  cloudy: '#818cf8',
  fog: '#94a3b8',
  rain: '#38bdf8',
  snow: '#a5f3fc',
  storm: '#f43f5e',
}

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage may be unavailable */
  }
}

function Panel({ children, className = '', delay = 0, label }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`cyber-card p-5 text-cyan-100 ${className}`}
    >
      {label && <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-cyan-300/80">{'>'} {label}</p>}
      {children}
    </motion.section>
  )
}

export default function App() {
  const [region, setRegion] = useState(() => load('miko-region', REGIONS[0]))
  const [unit, setUnit] = useState(() => load('miko-unit', 'C'))
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [gIdx, setGIdx] = useState(0)
  const [quip, setQuip] = useState('')

  useEffect(() => {
    const id = setInterval(() => setGIdx((i) => (i + 1) % GREETINGS.length), 3500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const ctrl = new AbortController()
    setLoading(true)
    setError('')
    fetchWeather(region, ctrl.signal)
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch((e) => {
        if (e.name === 'AbortError') return
        setError(e.message || 'Something went wrong')
        setLoading(false)
      })
    return () => ctrl.abort()
  }, [region, reloadKey])

  const changeRegion = useCallback((r) => {
    setRegion(r)
    save('miko-region', r)
  }, [])

  const toggleUnit = () => {
    const next = unit === 'C' ? 'F' : 'C'
    setUnit(next)
    save('miko-unit', next)
  }

  const cur = data?.current
  const isDay = cur ? cur.is_day === 1 : true
  const info = cur ? describeCode(cur.weather_code, cur.is_day) : { label: 'Loading…', emoji: '⚡', theme: 'clear' }
  const theme = info.theme
  const accent = ACCENT[theme] || ACCENT.clear
  const mood = !isDay ? 'sleepy' : theme === 'rain' || theme === 'storm' ? 'rain' : 'happy'

  const temp = (c) => (unit === 'C' ? Math.round(c) : Math.round((c * 9) / 5 + 32))

  const scan = useMemo(() => {
    if (!cur) return null
    return buildScan({
      city: region.name,
      dateStr: cur.time.slice(0, 10),
      timeStr: cur.time.slice(11, 16),
      isDay,
      theme,
      tempC: cur.temperature_2m,
      feelsC: cur.apparent_temperature,
      windKmh: cur.wind_speed_10m,
      rainChance: data.daily.precipitation_probability_max?.[0],
    })
  }, [cur, data, region.name, theme, isDay])

  const pokeMiko = () => {
    const list = QUIPS[theme] || QUIPS.clear
    setQuip(list[Math.floor(Math.random() * list.length)])
    setTimeout(() => setQuip(''), 3000)
  }

  const weekday = (dateStr, i) =>
    i === 0
      ? 'Today'
      : new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' }).format(new Date(dateStr + 'T12:00:00Z'))

  return (
    <div className="relative min-h-screen font-tech" style={{ '--accent': accent }}>
      <Background theme={theme} isDay={isDay} />

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glitch font-cyber text-2xl font-black uppercase tracking-wider text-white sm:text-5xl"
            >
              Miko<span className="text-pink-400">//</span>Weather
            </motion.h1>
            <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-cyan-300/80">
              Neon city forecast terminal v2.077
            </p>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={toggleUnit}
            aria-label="Toggle temperature unit"
            className="border border-pink-400 bg-pink-500/15 px-4 py-2 text-sm font-bold uppercase tracking-widest text-pink-200 shadow-[0_0_16px_rgba(236,72,153,0.55)] hover:bg-pink-500/30"
          >
            °{unit} → °{unit === 'C' ? 'F' : 'C'}
          </motion.button>
        </header>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Panel label="Current conditions">
              {error ? (
                <div className="py-6 text-center">
                  <p className="font-cyber text-2xl font-black text-pink-400">CONNECTION LOST</p>
                  <p className="mt-2 text-sm text-cyan-100">{error}</p>
                  <p className="text-xs text-cyan-300/70">Check your connection and try again.</p>
                  <button
                    type="button"
                    onClick={() => setReloadKey((k) => k + 1)}
                    className="mt-3 border border-cyan-300 bg-cyan-400/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-cyan-200 hover:bg-cyan-400/25"
                  >
                    Reconnect
                  </button>
                </div>
              ) : !cur ? (
                <div className="flex h-56 flex-col items-center justify-center gap-3">
                  <motion.div
                    className="h-12 w-12 border-2 border-cyan-300 border-t-pink-400"
                    style={{ borderRadius: '50%' }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  />
                  <p className="animate-pulse text-xs uppercase tracking-[0.3em] text-cyan-200">Establishing uplink…</p>
                </div>
              ) : (
                <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
                  <p className="text-sm uppercase tracking-widest text-cyan-100/80">
                    {region.name}
                    {region.country ? `, ${region.country}` : ''}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <div>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${region.name}-${unit}-${Math.round(cur.temperature_2m)}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="neon-text font-cyber text-7xl font-black leading-none text-white sm:text-8xl"
                        >
                          {temp(cur.temperature_2m)}°
                        </motion.div>
                      </AnimatePresence>
                      <p className="mt-2 font-cyber text-xl font-bold uppercase tracking-wider text-pink-300">{info.label}</p>
                      <p className="text-sm text-cyan-200/80">
                        MAX {temp(data.daily.temperature_2m_max[0])}° · MIN {temp(data.daily.temperature_2m_min[0])}°
                      </p>
                    </div>
                    <motion.div
                      className="text-7xl sm:text-9xl"
                      style={{ filter: 'drop-shadow(0 0 18px var(--accent))' }}
                      animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {info.emoji}
                    </motion.div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    {[
                      ['Feels like', `${temp(cur.apparent_temperature)}°`],
                      ['Humidity', `${cur.relative_humidity_2m}%`],
                      ['Wind', `${Math.round(cur.wind_speed_10m)} km/h`],
                      ['Rain chance', `${data.daily.precipitation_probability_max?.[0] ?? 0}%`],
                    ].map(([k, v]) => (
                      <div key={k} className="border border-cyan-400/30 bg-cyan-400/5 p-3">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">{k}</p>
                        <p className="font-cyber text-lg font-bold text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-widest text-cyan-300/70">
                    ▲ Sunrise {data.daily.sunrise[0].slice(11, 16)} · ▼ Sunset {data.daily.sunset[0].slice(11, 16)}
                  </p>
                </div>
              )}
            </Panel>

            {data && (
              <Panel label="Forecast feed" delay={0.1}>
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                  {data.daily.time.map((t, i) => {
                    const d = describeCode(data.daily.weather_code[i], 1)
                    return (
                      <motion.div
                        key={t}
                        whileHover={{ y: -4 }}
                        className="min-w-[88px] flex-1 border border-cyan-400/30 bg-cyan-400/5 p-3 text-center"
                      >
                        <p className="text-[11px] font-bold uppercase tracking-widest text-pink-300">{weekday(t, i)}</p>
                        <p className="my-1 text-3xl" style={{ filter: 'drop-shadow(0 0 8px var(--accent))' }}>
                          {d.emoji}
                        </p>
                        <p className="font-cyber text-sm font-bold text-white">{temp(data.daily.temperature_2m_max[i])}°</p>
                        <p className="text-xs text-cyan-300/60">{temp(data.daily.temperature_2m_min[i])}°</p>
                      </motion.div>
                    )
                  })}
                </div>
              </Panel>
            )}

            {scan && <CyberCard scan={scan} city={region.name} weatherLabel={info.label} />}
          </div>

          <div className="space-y-5">
            <Panel delay={0.05}>
              <Clock timeZone={data?.timezone} city={region.name} />
            </Panel>

            <Panel delay={0.15} className="z-10">
              <RegionPicker region={region} onChange={changeRegion} />
            </Panel>

            <Panel delay={0.25} label="AI companion" className="flex flex-col items-center">
              <div className="h-64 w-48">
                <Miko greeting={quip || GREETINGS[gIdx]} mood={mood} onClick={pokeMiko} />
              </div>
              <p className="mt-2 text-center text-[11px] uppercase tracking-widest text-cyan-300/70">
                Poke Miko for a weather mood
              </p>
            </Panel>
          </div>
        </div>

        <footer className="mt-8 text-center text-[11px] uppercase tracking-[0.25em] text-cyan-300/60">
          Data uplink:{' '}
          <a className="text-pink-300 underline underline-offset-4" href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Open-Meteo.com
          </a>
        </footer>
      </main>

      {/* floating sticker */}
      <motion.div
        className="fixed bottom-3 right-3 z-30 hidden h-36 w-28 sm:block"
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        <Miko greeting={GREETINGS[(gIdx + 3) % GREETINGS.length]} mood={mood} onClick={pokeMiko} />
      </motion.div>
    </div>
  )
}
