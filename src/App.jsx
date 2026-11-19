import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Background from './components/Background.jsx'
import Miko from './components/Miko.jsx'
import Clock from './components/Clock.jsx'
import RegionPicker from './components/RegionPicker.jsx'
import EpisodeCard from './components/EpisodeCard.jsx'
import { REGIONS, buildEpisode, describeCode, fetchWeather } from './lib/weather.js'

const GREETINGS = ['Hi!', 'こんにちは!', 'Namaste!', 'Hola!', 'Bonjour!', '안녕!', 'Hello~']

const QUIPS = {
  clear: ['The sky is in a great mood!', 'Sunshine power, activate!'],
  cloudy: ['Cloudy, but my heart is bright.', 'Clouds are just the sky’s blankets.'],
  fog: ['I can barely see the shrine…', 'Stay close, okay?'],
  rain: ['Share my umbrella?', 'Pitter-patter, pitter-patter~'],
  snow: ['Snow! Let’s build a snowman!', 'Brrr… cocoa time!'],
  storm: ['Eek! That thunder was loud!', 'Stay inside, hero!'],
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

function Card({ children, className = '', dark, delay = 0 }) {
  const tone = dark
    ? 'bg-slate-900/45 text-white border-white/15'
    : 'bg-white/65 text-slate-800 border-white/70'
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`rounded-3xl border p-5 shadow-xl backdrop-blur-md ${tone} ${className}`}
    >
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
  const info = cur ? describeCode(cur.weather_code, cur.is_day) : { label: 'Loading…', emoji: '🌸', theme: 'clear' }
  const theme = info.theme
  const dark = !isDay || theme === 'rain' || theme === 'storm'
  const mood = !isDay ? 'sleepy' : theme === 'rain' || theme === 'storm' ? 'rain' : 'happy'

  const temp = (c) => (unit === 'C' ? Math.round(c) : Math.round((c * 9) / 5 + 32))

  const episode = useMemo(() => {
    if (!cur) return null
    return buildEpisode({
      city: region.name,
      dateStr: cur.time.slice(0, 10),
      theme,
      tempC: cur.temperature_2m,
      feelsC: cur.apparent_temperature,
      windKmh: cur.wind_speed_10m,
      rainChance: data.daily.precipitation_probability_max?.[0],
    })
  }, [cur, data, region.name, theme])

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
    <div className="relative min-h-screen font-anime">
      <Background theme={theme} isDay={isDay} />

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6">
        <header className="mb-6 flex items-center justify-between gap-4">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-title text-3xl sm:text-5xl ${dark ? 'text-white' : 'text-slate-800 font-title-shadow'}`}
          >
            Miko Weather <span className="inline-block animate-bounce">🌸</span>
          </motion.h1>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={toggleUnit}
            aria-label="Toggle temperature unit"
            className="rounded-full bg-pink-500 px-4 py-2 text-sm font-black text-white shadow-lg"
          >
            °{unit} → °{unit === 'C' ? 'F' : 'C'}
          </motion.button>
        </header>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Card dark={dark}>
              {error ? (
                <div className="py-6 text-center">
                  <p className="text-4xl">😿</p>
                  <p className="mt-2 font-black">{error}</p>
                  <p className="text-sm opacity-70">Check your connection and try again.</p>
                  <button
                    type="button"
                    onClick={() => setReloadKey((k) => k + 1)}
                    className="mt-3 rounded-full bg-pink-500 px-5 py-2 text-sm font-black text-white"
                  >
                    Try again
                  </button>
                </div>
              ) : !cur ? (
                <div className="flex h-56 items-center justify-center">
                  <motion.span
                    className="text-6xl"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  >
                    🌸
                  </motion.span>
                </div>
              ) : (
                <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-70">
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
                          className="font-title text-7xl leading-none sm:text-8xl"
                        >
                          {temp(cur.temperature_2m)}°
                        </motion.div>
                      </AnimatePresence>
                      <p className="mt-2 text-xl font-black">{info.label}</p>
                      <p className="text-sm opacity-75">
                        H {temp(data.daily.temperature_2m_max[0])}° · L {temp(data.daily.temperature_2m_min[0])}°
                      </p>
                    </div>
                    <motion.div
                      className="text-7xl sm:text-9xl"
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
                      <div key={k} className={`rounded-2xl p-3 ${dark ? 'bg-white/10' : 'bg-white/70'}`}>
                        <p className="text-[11px] font-bold uppercase tracking-wider opacity-60">{k}</p>
                        <p className="text-lg font-black">{v}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs opacity-70">
                    🌅 Sunrise {data.daily.sunrise[0].slice(11, 16)} · 🌇 Sunset {data.daily.sunset[0].slice(11, 16)}
                  </p>
                </div>
              )}
            </Card>

            {data && (
              <Card dark={dark} delay={0.1}>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest opacity-70">Next days</p>
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                  {data.daily.time.map((t, i) => {
                    const d = describeCode(data.daily.weather_code[i], 1)
                    return (
                      <motion.div
                        key={t}
                        whileHover={{ y: -4 }}
                        className={`min-w-[88px] flex-1 rounded-2xl p-3 text-center ${dark ? 'bg-white/10' : 'bg-white/70'}`}
                      >
                        <p className="text-xs font-black">{weekday(t, i)}</p>
                        <p className="my-1 text-3xl">{d.emoji}</p>
                        <p className="text-sm font-black">{temp(data.daily.temperature_2m_max[i])}°</p>
                        <p className="text-xs opacity-60">{temp(data.daily.temperature_2m_min[i])}°</p>
                      </motion.div>
                    )
                  })}
                </div>
              </Card>
            )}

            {episode && (
              <Card dark={dark} delay={0.2}>
                <EpisodeCard episode={episode} city={region.name} weatherLabel={info.label} />
              </Card>
            )}
          </div>

          <div className="space-y-5">
            <Card dark={dark} delay={0.05}>
              <Clock timeZone={data?.timezone} city={region.name} />
            </Card>

            <Card dark={dark} delay={0.15} className="relative z-10">
              <RegionPicker region={region} onChange={changeRegion} dark={dark} />
            </Card>

            <Card dark={dark} delay={0.25} className="flex flex-col items-center">
              <div className="h-64 w-48">
                <Miko greeting={quip || GREETINGS[gIdx]} mood={mood} onClick={pokeMiko} />
              </div>
              <p className="mt-2 text-center text-xs font-bold opacity-70">Poke Miko for a weather mood!</p>
            </Card>
          </div>
        </div>

        <footer className={`mt-8 text-center text-xs font-bold ${dark ? 'text-white/70' : 'text-slate-700/70'}`}>
          Weather data by{' '}
          <a className="underline" href="https://open-meteo.com/" target="_blank" rel="noreferrer">
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
