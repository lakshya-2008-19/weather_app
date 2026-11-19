import { useState } from 'react'
import { motion } from 'framer-motion'

export default function EpisodeCard({ episode, city, weatherLabel }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const text = `📺 Miko Weather · Episode ${episode.number}: "${episode.title}" (${episode.genre})\n${city} · ${weatherLabel}\nMiko says: ${episode.tip}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy your episode card:', text)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-widest opacity-70">Today’s episode</p>
        <span className="rounded-full bg-pink-500 px-3 py-0.5 text-[11px] font-black uppercase text-white">
          {episode.genre}
        </span>
      </div>

      <motion.h3
        key={episode.title}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mt-2 font-title text-xl leading-snug sm:text-2xl"
      >
        Episode {episode.number}: “{episode.title}”
      </motion.h3>
      <p className="mt-1 text-sm opacity-80">{episode.blurb}</p>

      <div className="mt-4 space-y-2">
        {episode.meters.map((m, i) => (
          <div key={m.label} className="flex items-center gap-3 text-xs font-black">
            <span className="w-14 opacity-80">{m.label}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: m.color }}
                initial={{ width: 0 }}
                animate={{ width: `${m.value}%` }}
                transition={{ duration: 0.9, delay: 0.1 * i, ease: 'easeOut' }}
              />
            </div>
            <span className="w-8 text-right tabular-nums">{m.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-pink-500/15 p-3 text-sm font-bold">
        🌸 Miko says: {episode.tip}
      </div>

      <button
        type="button"
        onClick={share}
        className="mt-3 rounded-full bg-pink-500 px-4 py-1.5 text-xs font-black text-white shadow transition hover:bg-pink-600 active:scale-95"
      >
        {copied ? 'Copied! ✨' : 'Copy episode card'}
      </button>
    </div>
  )
}
