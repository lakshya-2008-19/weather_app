# Miko Weather 🌸

An anime-styled weather app built with **React, Vite, Tailwind CSS and Framer Motion**. Weather comes from the free [Open-Meteo](https://open-meteo.com/) API, so no API key is needed.

## Features

- Animated Miko stickers that say hi in different languages (poke her for a weather mood)
- Real-time clock for the selected region's own time zone
- Region selection: 10 presets, search for any city worldwide, or use your location
- Weather-aware animated backgrounds (sakura petals, stars, rain, snow, clouds, lightning)
- 6-day forecast with a °C / °F toggle
- **Unique feature: Cyber Weather Scan.** A neon cyberpunk diagnostic panel turns the weather into a threat level, system meters (fog, wind shear, thermal stress, precipitation), a recommended loadout and a note from Miko.EXE. Copy it as a transmission to share.

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Render

1. Push this project to GitHub.
2. On Render choose **New → Static Site** and connect the repo.
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Create the site.
