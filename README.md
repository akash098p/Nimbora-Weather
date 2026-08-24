# Meghdoot

**Meghdoot** (Sanskrit for "cloud messenger") is a modern, mobile-first weather forecasting web app built with pure **HTML, CSS and vanilla JavaScript** — no frameworks, no build step. It delivers live conditions, a synchronized 24-hour chart, a full 7-day forecast, air quality, an interactive rain-radar map, animated weather visuals and user preferences, all in a responsive glassmorphism interface.

## ✨ Features

### Current conditions & forecasts
- Live temperature, condition text, daily high/low and a large animated weather icon
- Real-time **Air Quality Index (AQI)** with category label
- **24-hour temperature graph** rendered as an inline SVG chart, synchronized with a horizontally swipeable hourly forecast strip
- Full-screen **7-day forecast** panel with daily UV, precipitation and wind metadata
- Today's details: precipitation probability & expected rainfall, cloud cover, maximum wind gusts, daily rain chance, sunrise & sunset
- Metric grid: UV index ring, humidity, real feel ("feels like") and wind speed with direction arrow

### Interactive weather map
- Embedded **Leaflet** map centered on the selected location
- Base layers: street map (OpenStreetMap) and terrain (OpenTopoMap)
- **Animated live rain radar** from RainViewer with a frame timeline and play control
- Forecast overlays for wind fields, precipitation, thunderstorm and severe storm/cyclone risk
- "My location" button and manual radar refresh

### Visual experience
- Dynamic sky gradients that adapt to the current weather code and day/night state
- Ambient effects: falling rain and snow particles, lightning flashes during storms, twinkling stars and moon glow at night
- Custom hand-crafted **animated SVG weather icons** (sun, moon, clouds, drizzle, snow, thunderstorm and more)

### Location & personalization
- City search powered by the Open-Meteo geocoding API (cities, towns, postcodes, countries)
- One-tap "use my current location" via the browser Geolocation API
- **Saved places** — store up to 8 favorite locations locally
- Preferences menu: Celsius/Fahrenheit units, System/Light/Dark theme, auto-refresh toggle
- Kolkata, India is used as the default city on first visit; your last selected location persists across visits

## 🧱 Tech stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Markup     | HTML5                                                   |
| Styling    | CSS3 — glassmorphism cards, responsive layout, animations |
| Logic      | Vanilla JavaScript (ES6+, no dependencies)              |
| Mapping    | [Leaflet](https://leafletjs.com/) 1.9.4                 |
| Weather    | [Open-Meteo](https://open-meteo.com/) APIs              |
| Radar      | [RainViewer](https://www.rainviewer.com/) public API    |
| Map tiles  | OpenStreetMap · OpenTopoMap                             |
| Storage    | `localStorage` (location, settings, saved places)       |

## 🚀 Getting started

No installation or build step is required.

1. Clone the repository:
   ```bash
   git clone https://github.com/akash098p/Meghdoot-Weather.git
   cd Meghdoot-Weather
   ```
2. Open `index.html` directly in a browser, or serve the folder locally:
   ```bash
   # Python
   python -m http.server 8080
   # or Node
   npx serve .
   ```
3. Visit `http://localhost:8080`.

> An internet connection is required for live weather data, map tiles and radar.

## 📁 Project structure

```text
Meghdoot/
├── index.html                  # Single-page app shell
├── assets/
├── css/
│   ├── styles.css              # Core layout, glass cards, hero, charts
│   ├── phase6.css              # Preferences & saved-places styling
│   ├── weather-background.css  # Sky scene & gradient themes
│   ├── weather-icon.css        # Icon container styles
│   ├── weather-icons-real.css  # Animated SVG icon styles
│   ├── search-ui.css           # Search overlay styling
│   ├── hourly-chart-fix.css    # Chart/hourly scroll alignment
│   └── final-layout-fixes.css  # Responsive polish
└── js/
    ├── default-city.js         # First-visit default location (Kolkata)
    ├── app-phase5.js           # Core app: API calls, rendering, charts
    ├── phase6.js               # Preferences, themes & saved locations
    ├── weather-background.js   # Condition-aware sky gradients
    ├── weather-effects.js      # Rain/snow particles, lightning, stars
    ├── weather-icon.js         # Icon helpers
    ├── weather-icons-real.js   # Animated SVG icon library
    ├── real-icon-init.js       # Icon bootstrap
    ├── search-ui.js            # Search overlay & geocoding UI
    ├── search-fix.js           # Mobile search reliability fixes
    ├── leaflet-weather-map.js  # Interactive map, radar & overlays
    └── hourly-chart-fix.js     # Synchronized 24-hour chart scrolling
```

Legacy prototypes (`app.js`, `interactive-map.js`, `radar.js`, `weather-layers.js` and their stylesheets) remain in the repository but are **not loaded** by `index.html`.

## 🔌 Data sources

- **Forecast, geocoding & air quality** — [Open-Meteo](https://open-meteo.com/en/docs) (free, no API key required)
- **Rain radar tiles** — [RainViewer](https://www.rainviewer.com/) public weather-maps API
- **Map imagery** — © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, [OpenTopoMap](https://opentopomap.org)

## 🗺️ Roadmap

1. ~~Reference UI foundation~~
2. ~~Polished responsive interface~~
3. ~~Live weather API + location search~~
4. ~~Advanced forecast details~~
5. ~~Interactive maps, radar & weather visuals~~
6. ~~Favorites / multiple saved locations~~
7. ~~Theme and unit preferences~~
8. PWA / offline support
9. Production deployment

---

## 🧑‍💻 Developer

<h3>Akash Pramanik</h3>

<p>
  <strong>For questions or support: </strong>
<a href="https://instagram.com/akash.098p" target="_blank">
  <img src="https://img.shields.io/badge/akash.098p-E4405F?style=flat&logo=instagram&logoColor=white"/>
</a> 

<a href="mailto:akashpramanik098@gmail.com">
  <img src="https://img.shields.io/badge/akashpramanik422%40gmail.com-D14836?style=flat&logo=gmail&logoColor=white"/>
</a>
</p>

---

Weather data by [Open-Meteo](https://open-meteo.com/) · Maps © OpenStreetMap contributors · Radar © RainViewer