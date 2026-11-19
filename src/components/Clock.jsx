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
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: tz,
  }).format(now)

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest opacity-70">Local time · {city}</p>
      <div className="mt-1 flex items-baseline gap-1 font-title text-5xl tabular-nums sm:text-6xl">
        <span>{get('hour')}</span>
        <span className="animate-pulse">:</span>
        <span>{get('minute')}</span>
        <span className="ml-2 text-2xl opacity-70 sm:text-3xl">{get('second')}</span>
      </div>
      <p className="mt-1 text-sm font-bold opacity-80">{dateText}</p>
      <p className="text-xs opacity-60">{tz.replace('_', ' ')}</p>
    </div>
  )
}
