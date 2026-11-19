const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export const REGIONS = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Kyoto', country: 'Japan', lat: 35.0116, lon: 135.7681 },
  { name: 'Osaka', country: 'Japan', lat: 34.6937, lon: 135.5023 },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.978 },
  { name: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.209 },
  { name: 'Mumbai', country: 'India', lat: 19.076, lon: 72.8777 },
  { name: 'London', country: 'United Kingdom', lat: 51.5072, lon: -0.1276 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
]

export async function fetchWeather({ lat, lon }, signal) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,precipitation',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '6',
  })
  const res = await fetch(`${FORECAST_URL}?${params}`, { signal })
  if (!res.ok) throw new Error('The weather spirits did not answer (HTTP ' + res.status + ')')
  return res.json()
}

export async function searchPlaces(query, signal) {
  const params = new URLSearchParams({ name: query, count: '6', language: 'en', format: 'json' })
  const res = await fetch(`${GEO_URL}?${params}`, { signal })
  if (!res.ok) throw new Error('Search failed')
  const data = await res.json()
  return (data.results || []).map((r) => ({
    name: r.name,
    country: r.country || '',
    admin: r.admin1 || '',
    lat: r.latitude,
    lon: r.longitude,
  }))
}

// WMO weather codes -> label, emoji and visual theme
export function describeCode(code, isDay = 1) {
  if (code === 0) return { label: 'Clear sky', emoji: isDay ? '☀️' : '🌙', theme: 'clear' }
  if (code === 1) return { label: 'Mostly clear', emoji: isDay ? '🌤️' : '🌙', theme: 'clear' }
  if (code === 2) return { label: 'Partly cloudy', emoji: isDay ? '⛅' : '☁️', theme: 'cloudy' }
  if (code === 3) return { label: 'Overcast', emoji: '☁️', theme: 'cloudy' }
  if (code === 45 || code === 48) return { label: 'Foggy', emoji: '🌫️', theme: 'fog' }
  if (code >= 51 && code <= 57) return { label: 'Drizzle', emoji: '🌦️', theme: 'rain' }
  if (code >= 61 && code <= 67) return { label: 'Rain', emoji: '🌧️', theme: 'rain' }
  if (code >= 71 && code <= 77) return { label: 'Snow', emoji: '❄️', theme: 'snow' }
  if (code >= 80 && code <= 82) return { label: 'Rain showers', emoji: '🌧️', theme: 'rain' }
  if (code === 85 || code === 86) return { label: 'Snow showers', emoji: '🌨️', theme: 'snow' }
  if (code >= 95) return { label: 'Thunderstorm', emoji: '⛈️', theme: 'storm' }
  return { label: 'Mysterious skies', emoji: '🌈', theme: 'cloudy' }
}

export const GRADIENTS = {
  clear: {
    day: 'linear-gradient(160deg,#7dd3fc 0%,#fbcfe8 55%,#fde68a 100%)',
    night: 'linear-gradient(160deg,#1e1b4b 0%,#4c1d95 55%,#831843 100%)',
  },
  cloudy: {
    day: 'linear-gradient(160deg,#cbd5e1 0%,#a5b4fc 55%,#f5d0fe 100%)',
    night: 'linear-gradient(160deg,#0f172a 0%,#334155 55%,#4c1d95 100%)',
  },
  fog: {
    day: 'linear-gradient(160deg,#d1d5db 0%,#e5e7eb 55%,#f3e8ff 100%)',
    night: 'linear-gradient(160deg,#1f2937 0%,#374151 55%,#4b5563 100%)',
  },
  rain: {
    day: 'linear-gradient(160deg,#475569 0%,#60a5fa 55%,#a5b4fc 100%)',
    night: 'linear-gradient(160deg,#0f172a 0%,#1e3a8a 55%,#312e81 100%)',
  },
  snow: {
    day: 'linear-gradient(160deg,#bae6fd 0%,#e0e7ff 55%,#fdf2f8 100%)',
    night: 'linear-gradient(160deg,#1e3a8a 0%,#312e81 55%,#6d28d9 100%)',
  },
  storm: {
    day: 'linear-gradient(160deg,#1f2937 0%,#4c1d95 55%,#be185d 100%)',
    night: 'linear-gradient(160deg,#030712 0%,#312e81 55%,#831843 100%)',
  },
}
