import { AnimatePresence, motion } from 'framer-motion'

// Miko, the cyberpunk shrine-maiden mascot (original character), drawn in SVG.
// mood: 'happy' | 'rain' | 'sleepy'
export function MikoSvg({ mood = 'happy', wave = true }) {
  return (
    <svg viewBox="0 -20 200 260" className="h-full w-full overflow-visible" role="img" aria-label="Miko, the weather mascot">
      <defs>
        <filter id="miko-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* back hair */}
      <path d="M40 100 C28 38 172 38 160 100 C166 150 152 190 142 204 L58 204 C48 190 34 150 40 100Z" fill="#120a2e" />
      <path d="M44 120 C42 150 52 180 60 196" stroke="#22d3ee" strokeWidth="3" fill="none" filter="url(#miko-glow)" />
      <path d="M156 120 C158 150 148 180 140 196" stroke="#ec4899" strokeWidth="3" fill="none" filter="url(#miko-glow)" />

      {/* hakama (dark with neon trim) */}
      <path d="M62 172 L138 172 L156 236 L44 236Z" fill="#1a0b3d" stroke="#ec4899" strokeWidth="2.5" filter="url(#miko-glow)" />
      <path d="M100 172 L100 236" stroke="#ec4899" strokeWidth="2" opacity="0.8" />
      {/* top */}
      <path d="M64 148 L136 148 L142 180 L58 180Z" fill="#0e1633" stroke="#22d3ee" strokeWidth="2.5" filter="url(#miko-glow)" />
      <path d="M84 148 L100 172 L116 148" stroke="#ec4899" strokeWidth="4" fill="none" strokeLinejoin="round" />
      <rect x="58" y="176" width="84" height="8" rx="2" fill="#facc15" filter="url(#miko-glow)" />
      <rect x="92" y="178" width="16" height="4" fill="#0e1633" />

      {/* left arm */}
      <path d="M64 156 Q48 176 56 196" stroke="#0e1633" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M64 156 Q48 176 56 196" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      <circle cx="56" cy="198" r="8" fill="#ffe3d3" />

      {/* waving right arm */}
      <g>
        {wave && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 136 156; -28 136 156; 6 136 156; -28 136 156; 0 136 156"
            dur="1.4s"
            repeatCount="indefinite"
          />
        )}
        <path d="M136 156 Q166 150 172 112" stroke="#0e1633" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M136 156 Q166 150 172 112" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
        <circle cx="172" cy="106" r="9" fill="#ffe3d3" />
        <rect x="166" y="118" width="12" height="5" rx="2" fill="#ec4899" filter="url(#miko-glow)" />
      </g>

      {/* head */}
      <ellipse cx="100" cy="102" rx="46" ry="48" fill="#ffe3d3" />
      {/* bangs */}
      <path d="M52 98 C52 48 148 48 148 98 C132 78 116 72 100 82 C84 72 68 78 52 98Z" fill="#120a2e" />
      <path d="M70 70 C86 62 112 62 130 70" stroke="#22d3ee" strokeWidth="2.5" fill="none" filter="url(#miko-glow)" />

      {/* headset */}
      <path d="M52 92 C50 40 150 40 148 92" stroke="#94a3b8" strokeWidth="5" fill="none" />
      <rect x="40" y="84" width="16" height="26" rx="6" fill="#0e1633" stroke="#ec4899" strokeWidth="3" filter="url(#miko-glow)" />
      <rect x="144" y="84" width="16" height="26" rx="6" fill="#0e1633" stroke="#22d3ee" strokeWidth="3" filter="url(#miko-glow)" />
      <path d="M44 108 Q44 128 64 132" stroke="#94a3b8" strokeWidth="3" fill="none" />
      <circle cx="66" cy="132" r="4" fill="#ec4899" filter="url(#miko-glow)" />

      {/* neon ribbons */}
      <path d="M54 66 L34 54 L40 78Z" fill="#ec4899" filter="url(#miko-glow)" />
      <path d="M146 66 L166 54 L160 78Z" fill="#22d3ee" filter="url(#miko-glow)" />

      {/* eyes */}
      {mood === 'sleepy' ? (
        <>
          <path d="M72 108 Q80 114 88 108" stroke="#120a2e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M112 108 Q120 114 128 108" stroke="#120a2e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'rain' ? (
        <>
          <ellipse cx="80" cy="108" rx="7" ry="10" fill="#120a2e" />
          <ellipse cx="120" cy="108" rx="7" ry="10" fill="#120a2e" />
          <circle cx="80" cy="108" r="4" fill="#22d3ee" />
          <circle cx="120" cy="108" r="4" fill="#ec4899" />
          <circle cx="82" cy="104" r="2.5" fill="#fff" />
          <circle cx="122" cy="104" r="2.5" fill="#fff" />
        </>
      ) : (
        <>
          <path d="M71 110 Q80 98 89 110" stroke="#120a2e" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M111 110 Q120 98 129 110" stroke="#120a2e" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* cheek glow + mouth */}
      <ellipse cx="68" cy="124" rx="9" ry="5" fill="#f0abfc" opacity="0.7" />
      <ellipse cx="132" cy="124" rx="9" ry="5" fill="#67e8f9" opacity="0.6" />
      <path d="M90 128 Q100 140 110 128 Q100 132 90 128Z" fill="#ec4899" stroke="#ec4899" strokeWidth="2" strokeLinejoin="round" />

      {/* accessories */}
      {mood === 'rain' && (
        <g filter="url(#miko-glow)">
          <path d="M14 34 Q100 -40 186 34 Q168 24 150 34 Q130 22 100 34 Q70 22 50 34 Q32 24 14 34Z" fill="#0e1633" stroke="#22d3ee" strokeWidth="3" />
          <path d="M100 -2 L100 34" stroke="#ec4899" strokeWidth="3" />
          <circle cx="100" cy="-4" r="4" fill="#ec4899" />
        </g>
      )}
      {mood === 'sleepy' && (
        <g fill="#67e8f9" fontFamily="Orbitron, monospace" fontWeight="700" filter="url(#miko-glow)">
          <text x="150" y="40" fontSize="22">z</text>
          <text x="166" y="20" fontSize="16">z</text>
        </g>
      )}
    </svg>
  )
}

export function Bubble({ text }) {
  return (
    <div className="relative h-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 8, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap border border-pink-400 bg-[#0a0420] px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-pink-300"
          style={{ boxShadow: '0 0 14px rgba(236,72,153,0.6)' }}
        >
          {text}
          <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-pink-400 bg-[#0a0420]" />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function Miko({ greeting, mood, className = '', onClick }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Bubble text={greeting} />
      <motion.button
        type="button"
        onClick={onClick}
        aria-label="Poke Miko"
        className="h-full w-full cursor-pointer"
        animate={{ y: [0, -6, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92, rotate: 6 }}
      >
        <MikoSvg mood={mood} />
      </motion.button>
    </div>
  )
}
