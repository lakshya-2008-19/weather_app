import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const SKY = {
  clear: {
    day: 'linear-gradient(180deg,#12023a 0%,#4a0a6b 45%,#b3226f 80%,#ff7a45 100%)',
    night: 'linear-gradient(180deg,#02010d 0%,#14063d 55%,#3b0a5e 100%)',
  },
  cloudy: {
    day: 'linear-gradient(180deg,#0b0a2a 0%,#23245c 55%,#4a2a7a 100%)',
    night: 'linear-gradient(180deg,#04030f 0%,#0f0d2e 55%,#201046 100%)',
  },
  fog: {
    day: 'linear-gradient(180deg,#0d1320 0%,#1f2a3d 55%,#3a3f5c 100%)',
    night: 'linear-gradient(180deg,#05070d 0%,#111827 55%,#1f2937 100%)',
  },
  rain: {
    day: 'linear-gradient(180deg,#020617 0%,#0c2a4a 55%,#16345e 100%)',
    night: 'linear-gradient(180deg,#01030a 0%,#071428 55%,#0b1d3a 100%)',
  },
  snow: {
    day: 'linear-gradient(180deg,#0a1230 0%,#1b3a6b 55%,#3b6ea5 100%)',
    night: 'linear-gradient(180deg,#050a1f 0%,#0f1f4a 55%,#25306b 100%)',
  },
  storm: {
    day: 'linear-gradient(180deg,#0a0010 0%,#2a0a3d 55%,#5a0f3a 100%)',
    night: 'linear-gradient(180deg,#030007 0%,#150626 55%,#3a0a2a 100%)',
  },
}

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

/* ---------- city + grid ---------- */

function Skyline() {
  const { buildings, windows } = useMemo(() => {
    const r = rng(7)
    const buildings = []
    const windows = []
    let x = -10
    while (x < 1210) {
      const w = 22 + r() * 40
      const h = 60 + r() * 190
      buildings.push({ x, w, h })
      const cols = Math.max(1, Math.floor(w / 9))
      const rows = Math.floor(h / 14)
      for (let c = 0; c < cols; c++) {
        for (let k = 0; k < rows; k++) {
          if (r() > 0.72) {
            windows.push({
              x: x + 4 + c * 9,
              y: 300 - h + 6 + k * 14,
              color: ['#22d3ee', '#ec4899', '#facc15', '#a78bfa'][Math.floor(r() * 4)],
              o: 0.4 + r() * 0.6,
              flick: r() > 0.93,
            })
          }
        }
      }
      x += w + 2 + r() * 6
    }
    return { buildings, windows }
  }, [])

  return (
    <svg
      className="absolute bottom-[18vh] left-0 h-[34vh] w-full opacity-90"
      viewBox="0 0 1200 300"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {buildings.map((b, i) => (
        <rect key={i} x={b.x} y={300 - b.h} width={b.w} height={b.h} fill="#080319" stroke="#22d3ee" strokeOpacity="0.25" />
      ))}
      {windows.map((w, i) => (
        <rect
          key={i}
          x={w.x}
          y={w.y}
          width="4"
          height="6"
          fill={w.color}
          opacity={w.o}
          className={w.flick ? 'flicker' : undefined}
        />
      ))}
    </svg>
  )
}

function GridFloor() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[18vh] overflow-hidden" style={{ background: 'linear-gradient(180deg,#0a0220,#12023a)' }}>
      <motion.div
        className="absolute -left-1/2 bottom-0 h-[300%] w-[200%] origin-bottom"
        style={{
          transform: 'perspective(260px) rotateX(62deg)',
          backgroundImage:
            'linear-gradient(rgba(236,72,153,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.55) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        animate={{ backgroundPositionY: ['0px', '60px'] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-pink-400 shadow-[0_0_16px_4px_rgba(236,72,153,0.8)]" />
    </div>
  )
}

/* ---------- weather effects ---------- */

function Rain({ heavy }) {
  const drops = useMemo(
    () =>
      makeItems(heavy ? 90 : 60, 11, (r) => ({
        left: r() * 100,
        delay: r() * 2,
        dur: 0.55 + r() * 0.55,
        h: 30 + r() * 40,
        hot: r() > 0.85,
      })),
    [heavy],
  )
  return drops.map((d, i) => (
    <motion.div
      key={i}
      className={`absolute top-0 w-[2px] rounded-full bg-gradient-to-b from-transparent ${d.hot ? 'to-pink-400' : 'to-cyan-300'}`}
      style={{ left: `${d.left}%`, height: d.h, rotate: 8, filter: 'drop-shadow(0 0 4px currentColor)' }}
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
        size: 3 + r() * 6,
        delay: r() * 6,
        dur: 6 + r() * 6,
        sway: 20 + r() * 40,
      })),
    [],
  )
  return flakes.map((f, i) => (
    <motion.div
      key={i}
      className="absolute top-0 rounded-full bg-cyan-100"
      style={{ left: `${f.left}%`, width: f.size, height: f.size, boxShadow: '0 0 10px 2px rgba(103,232,249,0.8)' }}
      initial={{ y: '-10vh', x: 0 }}
      animate={{ y: '110vh', x: [0, f.sway, -f.sway, 0] }}
      transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'linear' }}
    />
  ))
}

function DataRain() {
  const cols = useMemo(
    () =>
      makeItems(26, 33, (r) => ({
        left: r() * 100,
        delay: r() * 8,
        dur: 7 + r() * 7,
        text: Array.from({ length: 8 + Math.floor(r() * 8) }, () => (r() > 0.5 ? '1' : '0')).join('\n'),
        hot: r() > 0.7,
      })),
    [],
  )
  return cols.map((c, i) => (
    <motion.pre
      key={i}
      className="absolute top-0 m-0 select-none text-xs leading-4"
      style={{ left: `${c.left}%`, color: c.hot ? '#f472b6' : '#22d3ee', opacity: 0.35, textShadow: '0 0 8px currentColor' }}
      initial={{ y: '-30vh' }}
      animate={{ y: '110vh' }}
      transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'linear' }}
    >
      {c.text}
    </motion.pre>
  ))
}

function Stars() {
  const stars = useMemo(
    () =>
      makeItems(60, 44, (r) => ({
        left: r() * 100,
        top: r() * 50,
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

function Smog({ tone }) {
  const clouds = useMemo(
    () =>
      makeItems(5, 55, (r, i) => ({
        top: 4 + i * 11 + r() * 5,
        scale: 0.9 + r() * 1,
        dur: 70 + r() * 60,
        delay: -r() * 60,
      })),
    [],
  )
  return clouds.map((c, i) => (
    <motion.div
      key={i}
      className="absolute"
      style={{ top: `${c.top}%`, left: 0, scale: c.scale }}
      initial={{ x: '-30vw' }}
      animate={{ x: '120vw' }}
      transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'linear' }}
    >
      <div className="relative h-16 w-56 blur-[6px]">
        <div className="absolute bottom-0 left-0 h-10 w-56 rounded-full" style={{ background: tone }} />
        <div className="absolute bottom-4 left-8 h-14 w-16 rounded-full" style={{ background: tone }} />
        <div className="absolute bottom-4 left-24 h-16 w-24 rounded-full" style={{ background: tone }} />
      </div>
    </motion.div>
  ))
}

function NeonSun() {
  return (
    <motion.div
      className="absolute bottom-[30vh] left-1/2 h-48 w-48 -translate-x-1/2 rounded-full sm:h-64 sm:w-64"
      style={{
        background: 'linear-gradient(180deg,#facc15 0%,#fb923c 45%,#ec4899 100%)',
        boxShadow: '0 0 80px 20px rgba(236,72,153,0.45)',
        WebkitMaskImage: 'repeating-linear-gradient(180deg,#000 0,#000 14px,transparent 14px,transparent 18px)',
        maskImage: 'repeating-linear-gradient(180deg,#000 0,#000 14px,transparent 14px,transparent 18px)',
      }}
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function NeonMoon() {
  return (
    <motion.div
      className="absolute right-[10%] top-[8%] h-24 w-24 rounded-full"
      style={{
        background: 'radial-gradient(circle at 35% 35%, #ecfeff 0%, #67e8f9 55%, #0891b2 100%)',
        boxShadow: '0 0 60px 18px rgba(34,211,238,0.4)',
      }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function Lightning() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ background: 'radial-gradient(circle at 50% 0%, rgba(244,114,182,0.9), rgba(34,211,238,0.5) 60%, transparent)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 0.7, 0, 0.4, 0, 0, 0] }}
      transition={{ duration: 7, repeat: Infinity, times: [0, 0.5, 0.52, 0.55, 0.58, 0.62, 0.8, 1] }}
    />
  )
}

export default function Background({ theme, isDay }) {
  const reduce = useReducedMotion()
  const sky = SKY[theme]?.[isDay ? 'day' : 'night'] ?? SKY.clear.day

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: sky }}>
      {theme === 'clear' && isDay && <NeonSun />}
      {theme === 'clear' && !isDay && <NeonMoon />}
      <Skyline />
      <GridFloor />

      {!reduce && (
        <>
          {!isDay && theme !== 'storm' && theme !== 'rain' && <Stars />}
          {(theme === 'clear' || theme === 'cloudy') && <DataRain />}
          {theme === 'cloudy' && <Smog tone="rgba(129,140,248,0.35)" />}
          {theme === 'fog' && <Smog tone="rgba(148,163,184,0.45)" />}
          {theme === 'rain' && (
            <>
              <Smog tone="rgba(56,189,248,0.25)" />
              <Rain />
            </>
          )}
          {theme === 'snow' && (
            <>
              <Smog tone="rgba(165,243,252,0.25)" />
              <Snow />
            </>
          )}
          {theme === 'storm' && (
            <>
              <Smog tone="rgba(244,63,94,0.3)" />
              <Rain heavy />
              <Lightning />
            </>
          )}
        </>
      )}

      {/* vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />
    </div>
  )
}
