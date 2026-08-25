const FX = { rain: null, snow: null, lightning: null, stars: null };
function makeParticles(type, count) {
  const layer = document.createElement("div");
  layer.className = `weather-particles ${type}`;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("i");
    p.style.setProperty("--x", `${Math.random() * 100}%`);
    p.style.setProperty("--d", `${2 + Math.random() * 4}s`);
    p.style.setProperty("--delay", `${-Math.random() * 6}s`);
    p.style.setProperty("--s", `${0.55 + Math.random() * 0.9}`);
    layer.appendChild(p);
  }
  document.querySelector(".sky-scene")?.appendChild(layer);
  return layer;
}
function setEffects(code, isDay) {
  const scene = document.querySelector(".sky-scene");
  if (!scene) return;
  scene
    .querySelectorAll(
      ".weather-particles,.lightning-flash,.night-stars,.moon-glow",
    )
    .forEach((e) => e.remove());
  const night = !isDay;
  let type = "clear";
  if (code >= 95) type = "storm";
  else if (code >= 71 && code <= 86) type = "snow";
  else if (code >= 51 && code <= 82) type = "rain";
  else if (code >= 45 && code <= 48) type = "fog";
  else if (code >= 2) type = "cloud";
  scene.dataset.effect = type;
  if (night) {
    const stars = document.createElement("div");
    stars.className = "night-stars";
    for (let i = 0; i < 70; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 55 + "%";
      s.style.animationDelay = -Math.random() * 3 + "s";
      stars.appendChild(s);
    }
    scene.appendChild(stars);
    const moon = document.createElement("div");
    moon.className = "moon-glow";
    scene.appendChild(moon);
  }
  if (type === "rain" || type === "storm")
    makeParticles("rain", type === "storm" ? 90 : 65);
  if (type === "snow") makeParticles("snow", 45);
  if (type === "fog") {
    const fog = document.createElement("div");
    fog.className = "moving-fog";
    scene.appendChild(fog);
  }
  if (type === "storm") {
    const flash = document.createElement("div");
    flash.className = "lightning-flash";
    scene.appendChild(flash);
  }
}
function refreshEffects() {
  const w = window.meghdootGetWeather?.();
  if (w?.current) setEffects(w.current.weather_code, !!w.current.is_day);
}
window.meghdootEffects = { refresh: refreshEffects };
document.addEventListener("DOMContentLoaded", refreshEffects);
