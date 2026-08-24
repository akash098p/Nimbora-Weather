# Nimbora Weather

A modern weather forecasting website inspired by the supplied weather-app interface.

## Current stack

- HTML5
- CSS3 with responsive glassmorphism UI
- Vanilla JavaScript
- Open-Meteo Weather Forecast API
- Open-Meteo Geocoding API
- Open-Meteo Air Quality API
- Browser Geolocation API
- LocalStorage for the last selected location

## Phase 3 — Live weather

Implemented:

- Live current temperature and conditions
- Real high/low temperatures
- 7-day forecast data with the first 5 days displayed
- Live hourly temperature forecast
- Dynamic temperature graph
- Weather-code to condition/icon mapping
- Humidity and feels-like temperature
- Wind direction, speed and arrow
- UV index
- US AQI with a simple quality label
- Rain/thunderstorm condition messaging
- City/town location search
- Browser geolocation
- Saved last location
- Loading, empty and error states

Open-Meteo provides the forecast endpoint with current, hourly and daily variables, including temperature, humidity, apparent temperature, wind, weather code and UV index. citehttps://open-meteo.com/en/docs

## Project structure

```text
Nimbora-Weather/
├── index.html
├── README.md
├── .gitignore
└── src/
    ├── app.js
    └── styles.css
```

## Roadmap

1. ~~Reference UI foundation~~
2. ~~Polished responsive interface~~
3. ~~Live weather API + location search~~
4. Advanced forecast details and precipitation probability
5. Weather alerts, radar and interactive maps
6. Favorites / multiple saved locations
7. Theme and unit preferences
8. PWA/offline support
9. Production deployment
