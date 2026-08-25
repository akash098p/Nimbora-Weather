const MeghdootLeaflet = {
  map: null,
  base: null,
  terrain: null,
  radar: null,
  radarFrames: [],
  radarIndex: 0,
  points: null,
  mode: "map",
  grid: null,
  hour: 0,
  playing: false,
  playTimer: null,
};
const RV_META = "https://api.rainviewer.com/public/weather-maps.json",
  WX = "https://api.open-meteo.com/v1/forecast";
const statusText = {
  map: "Street map",
  radar: "Live precipitation radar",
  terrain: "Terrain map",
  wind: "Forecast wind field",
  rain: "Forecast precipitation",
  thunder: "Thunderstorm forecast",
  cyclone: "Severe storm / cyclone risk",
};
const status = (t) =>
  document
    .querySelectorAll("#leafletRadarStatus,#interactiveMapStatus")
    .forEach((e) => (e.textContent = t));
function addStyle() {
  if (document.querySelector("#meghdoot-map-style")) return;
  const s = document.createElement("style");
  s.id = "meghdoot-map-style";
  s.textContent =
    ".meghdoot-map-timeline{margin-top:10px;padding:10px 12px;border-radius:15px;background:rgba(8,25,45,.34);color:#fff}.meghdoot-map-timeline .tm-head{display:flex;align-items:center;justify-content:space-between;font-size:11px;margin-bottom:7px}.meghdoot-map-timeline input{width:100%;accent-color:#69d8ff}.meghdoot-map-timeline button{border:0;border-radius:10px;background:rgba(255,255,255,.14);color:#fff;padding:6px 10px}.meghdoot-wind-marker{background:rgba(20,45,70,.85);border:1px solid rgba(255,255,255,.35);border-radius:12px;color:#fff;text-align:center;font-size:9px;padding:3px}.meghdoot-wind-marker span{font-size:15px;line-height:12px}.meghdoot-wind-marker b{display:block}.meghdoot-thunder{font-size:20px;text-shadow:0 1px 3px #000}.meghdoot-severe{font-size:19px;text-shadow:0 1px 3px #000}.meghdoot-rain-dot{stroke:#fff;stroke-width:.5}";
  document.head.appendChild(s);
}
function initLeafletMap() {
  const el = document.querySelector("#leafletWeatherMap");
  if (!el || typeof L === "undefined") return;
  const p = window.meghdootGetPlace?.();
  if (!p) return;
  if (MeghdootLeaflet.map) MeghdootLeaflet.map.remove();
  const map = L.map(el, {
    zoomControl: false,
    attributionControl: true,
    preferCanvas: true,
  }).setView([p.latitude, p.longitude], 8);
  L.control.zoom({ position: "topright" }).addTo(map);
  MeghdootLeaflet.base = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    { maxZoom: 19, attribution: "© OpenStreetMap contributors" },
  ).addTo(map);
  MeghdootLeaflet.terrain = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 17,
      attribution: "© OpenStreetMap contributors, SRTM | OpenTopoMap",
    },
  );
  L.marker([p.latitude, p.longitude])
    .addTo(map)
    .bindPopup(`<b>${p.name || "Selected location"}</b>`);
  MeghdootLeaflet.map = map;
  addStyle();
  injectLayerButtons();
  injectTimeline();
  setTimeout(() => map.invalidateSize(), 150);
  loadRadarOverlay();
}
function injectLayerButtons() {
  const box = document.querySelector(".weather-map-actions");
  if (!box) return;
  const extras = [
    ["rain", "🌧️ Rain"],
    ["wind", "💨 Wind"],
    ["thunder", "⛈️ Thunder"],
    ["cyclone", "🌀 Storm/Cyclone"],
  ];
  extras.forEach(([id, label]) => {
    if (box.querySelector(`[data-weather-layer="${id}"]`)) return;
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.weatherLayer = id;
    b.textContent = label;
    box.appendChild(b);
  });
  box
    .querySelectorAll("[data-weather-layer]")
    .forEach((b) => (b.onclick = () => setLayer(b.dataset.weatherLayer)));
}
function injectTimeline() {
  if (document.querySelector("#meghdootMapTimeline")) return;
  const host = document.querySelector(".weather-map-actions");
  if (!host) return;
  const d = document.createElement("div");
  d.id = "meghdootMapTimeline";
  d.className = "meghdoot-map-timeline";
  d.innerHTML =
    '<div class="tm-head"><span id="meghdootTimelineLabel">Forecast timeline</span><button id="meghdootPlay">▶ Play</button></div><input id="meghdootTimeline" type="range" min="0" max="47" value="0" step="1">';
  host.parentElement.appendChild(d);
  d.querySelector("#meghdootTimeline").oninput = (e) => {
    MeghdootLeaflet.hour = +e.target.value;
    renderForecastLayer();
  };
  d.querySelector("#meghdootPlay").onclick = togglePlay;
}
function updateTimeline() {
  const s = document.querySelector("#meghdootTimeline"),
    l = document.querySelector("#meghdootTimelineLabel");
  if (s) s.value = MeghdootLeaflet.hour;
  if (l && MeghdootLeaflet.grid?.times?.[MeghdootLeaflet.hour])
    l.textContent = new Intl.DateTimeFormat("en-IN", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: MeghdootLeaflet.grid.timezone || undefined,
    }).format(new Date(MeghdootLeaflet.grid.times[MeghdootLeaflet.hour]));
}
function togglePlay() {
  if (MeghdootLeaflet.playing) {
    clearInterval(MeghdootLeaflet.playTimer);
    MeghdootLeaflet.playing = false;
    document.querySelector("#meghdootPlay").textContent = "▶ Play";
    return;
  }
  if (!MeghdootLeaflet.grid) {
    loadGrid(MeghdootLeaflet.mode);
    return;
  }
  MeghdootLeaflet.playing = true;
  document.querySelector("#meghdootPlay").textContent = "❚❚ Pause";
  MeghdootLeaflet.playTimer = setInterval(() => {
    MeghdootLeaflet.hour =
      (MeghdootLeaflet.hour + 1) %
      Math.min(48, MeghdootLeaflet.grid.times.length);
    renderForecastLayer();
  }, 650);
}
async function loadRadarOverlay() {
  try {
    status("Loading live radar…");
    const r = await fetch(RV_META, { cache: "no-store" });
    if (!r.ok) throw Error(r.status);
    const d = await r.json();
    MeghdootLeaflet.radarFrames = d.radar?.past || [];
    MeghdootLeaflet.radarIndex = MeghdootLeaflet.radarFrames.length - 1;
    if (!MeghdootLeaflet.radarFrames.length) throw Error("No radar frames");
    if (MeghdootLeaflet.mode === "radar") applyRadarOverlay();
    else
      status(
        "Radar ready · " +
          new Date(
            MeghdootLeaflet.radarFrames[MeghdootLeaflet.radarIndex].time * 1000,
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
  } catch (e) {
    console.error(e);
    status("Radar temporarily unavailable");
  }
}
function applyRadarOverlay() {
  const f = MeghdootLeaflet.radarFrames[MeghdootLeaflet.radarIndex];
  if (!f || !MeghdootLeaflet.map) return;
  if (MeghdootLeaflet.radar)
    MeghdootLeaflet.map.removeLayer(MeghdootLeaflet.radar);
  MeghdootLeaflet.radar = L.tileLayer(
    `https://tilecache.rainviewer.com${f.path}/256/{z}/{x}/{y}/2/1_1.png`,
    {
      opacity: 0.72,
      minZoom: 0,
      maxZoom: 12,
      tileSize: 256,
      zIndex: 600,
      attribution: "Radar © RainViewer",
    },
  ).addTo(MeghdootLeaflet.map);
  status(
    "Radar · " +
      new Date(f.time * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
  );
}
function clearData() {
  if (MeghdootLeaflet.radar) {
    MeghdootLeaflet.map.removeLayer(MeghdootLeaflet.radar);
    MeghdootLeaflet.radar = null;
  }
  if (MeghdootLeaflet.points) {
    MeghdootLeaflet.map.removeLayer(MeghdootLeaflet.points);
    MeghdootLeaflet.points = null;
  }
}
async function loadGrid(mode) {
  const p = window.meghdootGetPlace?.();
  if (!p || !MeghdootLeaflet.map) return;
  status("Loading " + statusText[mode].toLowerCase() + "…");
  const pts = [];
  for (let a = -2; a <= 2; a++)
    for (let b = -2; b <= 2; b++)
      pts.push([
        +(p.latitude + a * 1).toFixed(3),
        +(p.longitude + b * 1).toFixed(3),
      ]);
  const u = new URL(WX);
  u.search = new URLSearchParams({
    latitude: pts.map((x) => x[0]).join(","),
    longitude: pts.map((x) => x[1]).join(","),
    timezone: "auto",
    forecast_days: "3",
    hourly:
      "precipitation,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
  });
  try {
    const d = await fetch(u).then((r) => {
      if (!r.ok) throw Error(r.status);
      return r.json();
    });
    const rows = Array.isArray(d) ? d : [d];
    MeghdootLeaflet.grid = {
      rows,
      times: rows[0]?.hourly?.time || [],
      timezone: rows[0]?.timezone,
    };
    MeghdootLeaflet.hour = Math.min(
      MeghdootLeaflet.hour,
      Math.max(0, MeghdootLeaflet.grid.times.length - 1),
    );
    const s = document.querySelector("#meghdootTimeline");
    if (s) s.max = Math.min(47, MeghdootLeaflet.grid.times.length - 1);
    renderForecastLayer();
  } catch (e) {
    console.error(e);
    status("Weather layer unavailable");
  }
}
function drawGrid(rows, mode) {
  if (MeghdootLeaflet.points)
    MeghdootLeaflet.map.removeLayer(MeghdootLeaflet.points);
  const group = L.layerGroup();
  rows.forEach((x) => {
    const lat = x.latitude,
      lon = x.longitude;
    if (lat == null || lon == null) return;
    const rain = Number(x.precipitation ?? 0),
      wind = Number(x.wind_speed_10m ?? 0),
      gust = Number(x.wind_gusts_10m ?? 0),
      dir = Number(x.wind_direction_10m ?? 0),
      code = Number(x.weather_code ?? 0);
    if (mode === "wind" && wind >= 8) {
      const icon = L.divIcon({
        className: "meghdoot-wind-marker",
        html: `<span style="display:block;transform:rotate(${dir}deg)">➤</span><b>${Math.round(wind)}</b>`,
        iconSize: [46, 34],
        iconAnchor: [23, 17],
      });
      L.marker([lat, lon], { icon, keyboard: false })
        .bindTooltip(
          `💨 Wind ${Math.round(wind)} km/h · Gust ${Math.round(gust)} km/h`,
        )
        .addTo(group);
    }
    if (mode === "rain" && rain > 0.05)
      L.circleMarker([lat, lon], {
        radius: Math.min(24, 8 + rain * 3),
        className: "meghdoot-rain-dot",
        fillOpacity: 0.48,
      })
        .bindTooltip(`🌧️ Rain ${rain.toFixed(1)} mm`)
        .addTo(group);
    if (mode === "thunder" && code >= 95)
      L.marker([lat, lon], {
        icon: L.divIcon({
          className: "meghdoot-thunder",
          html: "⛈️",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      })
        .bindTooltip("⛈️ Thunderstorm forecast")
        .addTo(group);
    if (mode === "cyclone" && (gust >= 63 || wind >= 63 || code >= 95))
      L.marker([lat, lon], {
        icon: L.divIcon({
          className: "meghdoot-severe",
          html: "🌀",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      })
        .bindTooltip(`🌀 Severe storm risk · gust ${Math.round(gust)} km/h`)
        .addTo(group);
  });
  MeghdootLeaflet.points = group.addTo(MeghdootLeaflet.map);
}
function renderForecastLayer() {
  if (
    !MeghdootLeaflet.grid ||
    MeghdootLeaflet.mode === "radar" ||
    MeghdootLeaflet.mode === "map" ||
    MeghdootLeaflet.mode === "terrain"
  )
    return;
  const i = MeghdootLeaflet.hour,
    rows = MeghdootLeaflet.grid.rows.map((x) => {
      const h = x.hourly || {};
      return {
        latitude: x.latitude,
        longitude: x.longitude,
        precipitation: h.precipitation?.[i] ?? 0,
        wind_speed_10m: h.wind_speed_10m?.[i] ?? 0,
        wind_gusts_10m: h.wind_gusts_10m?.[i] ?? 0,
        wind_direction_10m: h.wind_direction_10m?.[i] ?? 0,
        weather_code: h.weather_code?.[i] ?? 0,
      };
    });
  drawGrid(rows, MeghdootLeaflet.mode);
  updateTimeline();
  const t = MeghdootLeaflet.grid.times[i];
  if (t)
    status(
      `${statusText[MeghdootLeaflet.mode]} · ${new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(t))}`,
    );
}
function setLayer(mode) {
  if (!MeghdootLeaflet.map) return;
  MeghdootLeaflet.mode = mode;
  document
    .querySelectorAll("[data-weather-layer]")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.weatherLayer === mode),
    );
  clearData();
  if (MeghdootLeaflet.base) MeghdootLeaflet.map.removeLayer(MeghdootLeaflet.base);
  if (MeghdootLeaflet.terrain)
    MeghdootLeaflet.map.removeLayer(MeghdootLeaflet.terrain);
  if (mode === "map") {
    MeghdootLeaflet.base.addTo(MeghdootLeaflet.map);
    status("Street map");
    return;
  }
  if (mode === "terrain") {
    MeghdootLeaflet.terrain.addTo(MeghdootLeaflet.map);
    status("Terrain map");
    return;
  }
  MeghdootLeaflet.base.addTo(MeghdootLeaflet.map);
  if (mode === "radar")
    return MeghdootLeaflet.radarFrames.length
      ? applyRadarOverlay()
      : loadRadarOverlay();
  if (!MeghdootLeaflet.grid) return loadGrid(mode);
  renderForecastLayer();
}
function init() {
  initLeafletMap();
  document.querySelector("#leafletLocate")?.addEventListener("click", () => {
    const p = window.meghdootGetPlace?.();
    if (p)
      MeghdootLeaflet.map?.flyTo([p.latitude, p.longitude], 9, {
        duration: 0.7,
      });
  });
  document
    .querySelector("#leafletRadarRefresh")
    ?.addEventListener("click", loadRadarOverlay);
  window.addEventListener("resize", () => MeghdootLeaflet.map?.invalidateSize());
  window.meghdootLeafletMap = {
    refresh: initLeafletMap,
    radarRefresh: loadRadarOverlay,
    setLayer,
  };
}
document.addEventListener("DOMContentLoaded", init);
