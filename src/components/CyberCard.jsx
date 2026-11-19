import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { meterColor } from '../lib/cyber.js'

function useTypewriter(text, speed = 18) {
  const [out, setOut] = useState('')
  useEffect(() => {
    setOut('')
    let i = 0
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return out
}

export default function CyberCard({ scan, city, weatherLabel }) {
  const [copied, setCopied] = useState(false)
  const typed = useTypewriter(scan.briefing)

  const transmit = async () => {
    const text = [
      `[${scan.code}] CYBER WEATHER SCAN // ${city.toUpperCase()}`,
      `Conditions: ${weatherLabel} | Threat: ${scan.threat.level} (${scan.threat.status})`,
      `Loadout: ${scan.loadout.join(', ')}`,
      `MIKO.EXE: ${scan.tip}`,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy your scan report:', text)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-3xl border border-cyan-400/60 bg-[#070714]/90 p-5 font-mono text-cyan-100 backdrop-blur-md"
      style={{ boxShadow: '0 0 0 1px rgba(236,72,153,0.35), 0 0 32px rgba(34,211,238,0.28), 0 0 70px rgba(236,72,153,0.18)' }}
    >
      {/* scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)' }}
      />
      {/* moving scan beam */}
      <motion.div
        className="pointer-events-none absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent"
        initial={{ top: '-20%' }}
        animate={{ top: '110%' }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.25em] text-cyan-300/80">
          <span>{'>'} Cyber weather scan</span>
          <span>
            {scan.code} · {scan.sector}
          </span>
        </div>

        <motion.h3
          className="mt-3 text-2xl font-black uppercase tracking-wider text-white sm:text-3xl"
          style={{ textShadow: '2px 0 #ec4899, -2px 0 #22d3ee' }}
          animate={{ x: [0, 0, -2, 2, 0, 0, 0], opacity: [1, 1, 0.85, 1, 1, 1, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.8, 0.83, 0.86, 0.9, 0.95, 1] }}
        >
          Sector: {city}
        </motion.h3>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div
            className="rounded-lg border px-3 py-1.5 text-sm font-black uppercase tracking-widest"
            style={{ borderColor: scan.threat.color, color: scan.threat.color, boxShadow: `0 0 14px ${scan.threat.color}66` }}
          >
            Threat: {scan.threat.level}
          </div>
          <span className="text-xs uppercase tracking-widest text-pink-300">{scan.threat.status}</span>
        </div>

        <p className="mt-4 min-h-[3rem] text-sm leading-relaxed text-cyan-100/90">
          <span className="text-pink-400">{'>'}</span> {typed}
          <span className="animate-pulse text-cyan-300">▌</span>
        </p>

        <div className="mt-4 space-y-2.5">
          {scan.meters.map((m, i) => {
            const c = meterColor(m.value)
            return (
              <div key={m.label} className="flex items-center gap-3 text-[11px] uppercase tracking-wider">
                <span className="w-28 text-cyan-300/80">{m.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-sm bg-white/10">
                  <motion.div
                    className="h-full"
                    style={{ background: c, boxShadow: `0 0 10px ${c}` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 0.9, delay: 0.1 * i, ease: 'easeOut' }}
                  />
                </div>
                <span className="w-8 text-right tabular-nums" style={{ color: c }}>
                  {m.value}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-300/80">Recommended loadout</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {scan.loadout.map((item) => (
              <span
                key={item}
                className="rounded border border-pink-400/60 bg-pink-500/10 px-2.5 py-1 text-xs font-bold text-pink-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-cyan-400/40 bg-cyan-400/5 p-3 text-sm">
          <span className="font-black text-pink-300">MIKO.EXE:</span> {scan.tip}
        </div>

        <button
          type="button"
          onClick={transmit}
          className="mt-4 rounded border border-cyan-300 bg-cyan-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-cyan-200 transition hover:bg-cyan-400/25 active:scale-95"
        >
          {copied ? 'Transmitted ✓' : 'Transmit report'}
        </button>
      </div>
    </motion.section>
  )
}
