import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { GRADIENTS } from '../lib/weather.js'

function rng(seed) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function makeItems(count, seed, fn) {
  const rand = rng(seed)
  return Array.from({ length: count }, (_, i) => fn(rand, i))
}

function Rain({ heavy }) {
  const drops = useMemo(
    () =>
      makeItems(heavy ? 90 : 60, 11, (r) => ({
        left: r() * 100,
        delay: r() * 2,
        dur: 0.6 + r() * 0.6,
        h: 30 + r() * 40,
      })),
    [heavy],
  )
  return drops.map((d, i) => (
    <motion.div
      key={i}
      className="absolute top-0 w-[2px] rounded-full bg-gradient-to-b from-transparent to-sky-200/80"
      style={{ left: `${d.left}%`, height: d.h, rotate: 8 }}
      initial={{ y: '-15vh' }}
      animate={{ y: '110vh' }}
      transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'linear' }}
    />
  ))
}

function Snow() {
  const flakes = useMemo(
    () =>
      makeItems(55, 22, (r) => ({
        left: r() * 100,
        size: 4 + r() * 8,
        delay: r() * 6,
        dur: 6 + r() * 6,
        sway: 20 + r() * 40,
      })),
    [],
  )
  return flakes.map((f, i) => (
    <motion.div
      key={i}
      className="absolute top-0 rounded-full bg-white/90 blur-[0.5px]"
      style={{ left: `${f.left}%`, width: f.size, height: f.size }}
      initial={{ y: '-10vh', x: 0 }}
      animate={{ y: '110vh', x: [0, f.sway, -f.sway, 0] }}
      transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'linear' }}
    />
  ))
}

function Sakura() {
  const petals = useMemo(
    () =>
      makeItems(18, 33, (r) => ({
        left: r() * 100,
        size: 10 + r() * 10,
        delay: r() * 8,
        dur: 8 + r() * 6,
        sway: 40 + r() * 60,
        spin: 180 + r() * 360,
      })),
    [],
  )
  return petals.map((p, i) => (
    <motion.div
      key={i}
      className="absolute top-0"
      style={{
        left: `${p.left}%`,
        width: p.size,
        height: p.size * 0.7,
        borderRadius: '70% 0 70% 0',
        background: 'linear-gradient(135deg,#fbcfe8,#f472b6)',
        opacity: 0.85,
      }}
      initial={{ y: '-10vh', x: 0, rotate: 0 }}
      animate={{ y: '110vh', x: [0, p.sway, -p.sway / 2, p.sway], rotate: p.spin }}
      transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
    />
  ))
}

function Stars() {
  const stars = useMemo(
    () =>
      makeItems(60, 44, (r) => ({
        left: r() * 100,
        top: r() * 70,
        size: 1.5 + r() * 2.5,
        delay: r() * 3,
        dur: 2 + r() * 3,
      })),
    [],
  )
  return stars.map((s, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full bg-white"
      style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
      animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.4, 1] }}
      transition={{ duration: s.dur, delay: s.delay, repeat: Infinity }}
    />
  ))
}

function Clouds({ dark }) {
  const clouds = useMemo(
    () =>
      makeItems(5, 55, (r, i) => ({
        top: 4 + i * 14 + r() * 6,
        scale: 0.8 + r() * 0.9,
        dur: 70 + r() * 60,
        delay: -r() * 60,
      })),
    [],
  )
  const tone = dark ? 'rgba(148,163,184,0.35)' : 'rgba(255,255,255,0.65)'
  return clouds.map((c, i) => (
    <motion.div
      key={i}
      className="absolute"
      style={{ top: `${c.top}%`, left: 0, scale: c.scale }}
      initial={{ x: '-30vw' }}
      animate={{ x: '120vw' }}
      transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'linear' }}
    >
      <div className="relative h-16 w-48 blur-[2px]">
        <div className="absolute bottom-0 left-0 h-10 w-48 rounded-full" style={{ background: tone }} />
        <div className="absolute bottom-4 left-6 h-14 w-14 rounded-full" style={{ background: tone }} />
        <div className="absolute bottom-4 left-20 h-16 w-20 rounded-full" style={{ background: tone }} />
      </div>
    </motion.div>
  ))
}

function Sun() {
  return (
    <motion.div
      className="absolute right-[8%] top-[6%] h-40 w-40 rounded-full"
      style={{
        background: 'radial-gradient(circle, #fff7ae 0%, #fde047 40%, rgba(253,224,71,0) 70%)',
      }}
      animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function Moon() {
  return (
    <motion.div
      className="absolute right-[10%] top-[8%] h-24 w-24 rounded-full"
      style={{
        background: 'radial-gradient(circle at 35% 35%, #fefce8 0%, #fde68a 60%, #fbbf24 100%)',
        boxShadow: '0 0 60px 20px rgba(253,230,138,0.35)',
      }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function Lightning() {
  return (
    <motion.div
      className="absolute inset-0 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 0.75, 0, 0.45, 0, 0, 0] }}
      transition={{ duration: 7, repeat: Infinity, times: [0, 0.5, 0.52, 0.55, 0.58, 0.62, 0.8, 1] }}
    />
  )
}

export default function Background({ theme, isDay }) {
  const reduce = useReducedMotion()
  const gradient = GRADIENTS[theme]?.[isDay ? 'day' : 'night'] ?? GRADIENTS.clear.day

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: gradient }}>
      {!reduce && (
        <>
          {theme === 'clear' && isDay && (
            <>
              <Sun />
              <Sakura />
            </>
          )}
          {theme === 'clear' && !isDay && (
            <>
              <Stars />
              <Moon />
            </>
          )}
          {theme === 'cloudy' && (
            <>
              {!isDay && <Stars />}
              <Clouds dark={!isDay} />
            </>
          )}
          {theme === 'fog' && <Clouds dark={!isDay} />}
          {theme === 'rain' && (
            <>
              <Clouds dark />
              <Rain />
            </>
          )}
          {theme === 'snow' && (
            <>
              <Clouds dark={!isDay} />
              <Snow />
            </>
          )}
          {theme === 'storm' && (
            <>
              <Clouds dark />
              <Rain heavy />
              <Lightning />
            </>
          )}
        </>
      )}
    </div>
  )
}
