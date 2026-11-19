// Cyber Weather Scan: turns the forecast into a cyberpunk "system diagnostic".

const BRIEFINGS = {
  clear: 'Sky grid is clean. Neon skyline fully visible, zero atmospheric interference.',
  cloudy: 'Cloud ceiling is low. Corporate holo-ads reflect brighter off the overcast.',
  fog: 'Smog-mist blankets the sector. Navigation HUD strongly advised.',
  rain: 'Acid-rain protocol active. Streets are mirrored in neon puddles.',
  snow: 'Cryo-front inbound. Streets are freezing and drones are running slow.',
  storm: 'EMP-grade lightning detected overhead. Stay off the grid if you can.',
}

const LOADOUT = {
  clear: ['Smart shades', 'Light jacket', 'Energy drink'],
  cloudy: ['Light hoodie', 'Power bank', 'Earbuds'],
  fog: ['Reflective jacket', 'Flashlight', 'Mask'],
  rain: ['Waterproof coat', 'Umbrella', 'Sealed backpack'],
  snow: ['Thermal coat', 'Gloves', 'Heated boots'],
  storm: ['Stay indoors', 'Charged devices', 'Surge protector'],
}

function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function dayOfYear(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z')
  const start = Date.UTC(d.getUTCFullYear(), 0, 0)
  return Math.floor((d.getTime() - start) / 86400000)
}

const clamp = (n) => Math.max(2, Math.min(100, Math.round(n)))

export function buildScan({ city, dateStr, timeStr, theme, tempC, feelsC, windKmh, rainChance, isDay }) {
  const rain = rainChance ?? 0

  let score = { clear: 0, cloudy: 5, fog: 22, rain: 28, snow: 28, storm: 60 }[theme] ?? 5
  if (windKmh > 40) score += 25
  else if (windKmh > 25) score += 10
  if (tempC <= 0 || tempC >= 35) score += 25
  else if (tempC <= 5 || tempC >= 32) score += 10
  if (rain >= 70) score += 10

  let threat
  if (score < 15) threat = { level: 'LOW', status: 'ALL SYSTEMS STABLE', color: '#22d3ee' }
  else if (score < 35) threat = { level: 'MODERATE', status: 'STAY ALERT', color: '#facc15' }
  else if (score < 60) threat = { level: 'HIGH', status: 'CAUTION ADVISED', color: '#fb923c' }
  else threat = { level: 'CRITICAL', status: 'TAKE COVER', color: '#f43f5e' }

  const meters = [
    { label: 'Fog density', value: clamp({ clear: 4, cloudy: 22, fog: 92, rain: 45, snow: 50, storm: 55 }[theme] ?? 20) },
    { label: 'Wind shear', value: clamp(windKmh * 2) },
    { label: 'Thermal stress', value: clamp(Math.abs(feelsC - 22) * 4) },
    { label: 'Precip static', value: clamp(rain || { rain: 70, storm: 90, snow: 70 }[theme] || 5) },
  ]

  const loadout = [...(LOADOUT[theme] || LOADOUT.cloudy)]
  if (tempC >= 32 && theme !== 'storm') loadout.push('Cooling vest')
  if (tempC <= 5 && theme !== 'snow') loadout.push('Thermal layer')

  let tip
  if (theme === 'rain' || theme === 'storm' || rain >= 60) {
    tip = 'Take an umbrella! I do not want your circuits, or you, to get soaked.'
  } else if (theme === 'snow' || tempC <= 5) {
    tip = 'Bundle up and drink something warm. Cold weather lowers your battery life.'
  } else if (tempC >= 33) {
    tip = 'It is scorching. Drink water and stay in the shade.'
  } else if (tempC >= 26) {
    tip = 'Warm and bright. Light clothes and a cold drink will do.'
  } else if (theme === 'clear') {
    tip = 'Perfect conditions. A night walk through the neon is highly recommended.'
  } else {
    tip = 'Calm and mild. A light jacket is enough for today’s mission.'
  }

  const code = `SCAN-${String(dayOfYear(dateStr)).padStart(3, '0')}-${String(hashString(city + dateStr) % 10000).padStart(4, '0')}`

  return {
    code,
    time: timeStr,
    sector: isDay ? 'DAYSHIFT' : 'NIGHTSHIFT',
    briefing: BRIEFINGS[theme] || BRIEFINGS.cloudy,
    threat,
    meters,
    loadout,
    tip,
  }
}

export function meterColor(value) {
  if (value < 35) return '#22d3ee'
  if (value < 65) return '#facc15'
  return '#f43f5e'
}
