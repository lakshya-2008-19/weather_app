import { AnimatePresence, motion } from 'framer-motion'

// Miko is an original shrine-maiden mascot drawn in SVG.
// mood: 'happy' | 'rain' | 'sleepy'
export function MikoSvg({ mood = 'happy', wave = true }) {
  return (
    <svg viewBox="0 -20 200 260" className="h-full w-full overflow-visible" role="img" aria-label="Miko, the weather mascot">
      {/* back hair */}
      <path
        d="M40 100 C28 38 172 38 160 100 C166 150 152 190 142 204 L58 204 C48 190 34 150 40 100Z"
        fill="#2b2250"
      />
      {/* hakama */}
      <path d="M62 172 L138 172 L156 236 L44 236Z" fill="#e8445a" />
      <path d="M100 172 L100 236" stroke="#c42f45" strokeWidth="2" />
      {/* top */}
      <path d="M64 148 L136 148 L142 180 L58 180Z" fill="#ffffff" />
      <path d="M84 148 L100 172 L116 148" stroke="#e8445a" strokeWidth="4" fill="none" strokeLinejoin="round" />
      <rect x="58" y="176" width="84" height="8" rx="3" fill="#fbbf24" />
      {/* left arm */}
      <path d="M64 156 Q48 176 56 196" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" fill="none" />
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
        <path d="M136 156 Q166 150 172 112" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" fill="none" />
        <circle cx="172" cy="106" r="9" fill="#ffe3d3" />
      </g>
      {/* head */}
      <ellipse cx="100" cy="102" rx="46" ry="48" fill="#ffe3d3" />
      {/* bangs */}
      <path
        d="M52 98 C52 48 148 48 148 98 C132 78 116 72 100 82 C84 72 68 78 52 98Z"
        fill="#2b2250"
      />
      {/* ribbons */}
      <path d="M54 82 L34 70 L40 94Z" fill="#e8445a" />
      <path d="M146 82 L166 70 L160 94Z" fill="#e8445a" />
      <circle cx="100" cy="56" r="7" fill="#fbbf24" />
      {/* eyes */}
      {mood === 'sleepy' ? (
        <>
          <path d="M72 108 Q80 114 88 108" stroke="#2b2250" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M112 108 Q120 114 128 108" stroke="#2b2250" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'rain' ? (
        <>
          <ellipse cx="80" cy="108" rx="7" ry="10" fill="#2b2250" />
          <ellipse cx="120" cy="108" rx="7" ry="10" fill="#2b2250" />
          <circle cx="82" cy="104" r="3" fill="#fff" />
          <circle cx="122" cy="104" r="3" fill="#fff" />
        </>
      ) : (
        <>
          <path d="M71 110 Q80 98 89 110" stroke="#2b2250" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M111 110 Q120 98 129 110" stroke="#2b2250" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* blush + mouth */}
      <ellipse cx="68" cy="124" rx="9" ry="5" fill="#fda4af" opacity="0.7" />
      <ellipse cx="132" cy="124" rx="9" ry="5" fill="#fda4af" opacity="0.7" />
      <path d="M90 128 Q100 140 110 128 Q100 132 90 128Z" fill="#e8445a" stroke="#e8445a" strokeWidth="2" strokeLinejoin="round" />
      {/* accessories */}
      {mood === 'rain' && (
        <g>
          <path d="M14 34 Q100 -40 186 34 Q168 24 150 34 Q130 22 100 34 Q70 22 50 34 Q32 24 14 34Z" fill="#7aa7ff" />
          <path d="M100 -2 L100 34" stroke="#4b6fd1" strokeWidth="3" />
          <circle cx="100" cy="-4" r="4" fill="#4b6fd1" />
        </g>
      )}
      {mood === 'sleepy' && (
        <g fill="#e0e7ff" fontFamily="'Dela Gothic One', sans-serif" fontWeight="700">
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
          className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-2xl border-2 border-pink-300 bg-white px-4 py-1.5 text-sm font-black text-pink-600 shadow-md"
        >
          {text}
          <span className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-pink-300 bg-white" />
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
