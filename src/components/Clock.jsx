import { useEffect, useState } from 'react'

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function Clock({ timeZone, city }) {
  const now = useNow()
  const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone

  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: tz,
  }).formatToParts(now)
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '00'

  const dateText = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: tz,
  }).format(now)

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-300/80">{'>'} Sys clock // {city}</p>
      <div className="neon-text mt-2 flex items-baseline gap-1 font-cyber text-4xl font-black tabular-nums text-white sm:text-5xl">
        <span>{get('hour')}</span>
        <span className="animate-pulse text-pink-400">:</span>
        <span>{get('minute')}</span>
        <span className="ml-2 text-xl text-pink-400 sm:text-2xl">{get('second')}</span>
      </div>
      <p className="mt-2 text-sm uppercase tracking-widest text-cyan-100">{dateText}</p>
      <p className="text-xs uppercase tracking-wider text-cyan-300/60">TZ: {tz.replace('_', ' ')}</p>
    </div>
  )
}
