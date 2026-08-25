const BG = {
  clearDay: ["#2f7ed6", "#8fd2ff"],
  clearNight: ["#081b3b", "#233d70"],
  cloudDay: ["#6e86a0", "#afc0d1"],
  cloudNight: ["#0d1d35", "#30445f"],
  rainDay: ["#3f688e", "#7699b4"],
  rainNight: ["#071528", "#1d334d"],
  stormDay: ["#344d6b", "#667b91"],
  stormNight: ["#050b16", "#18263a"],
  snowDay: ["#8fb3ca", "#d9e8ef"],
  snowNight: ["#182a3d", "#51677b"],
  fogDay: ["#849eaa", "#cbd9dc"],
  fogNight: ["#202e39", "#53636b"],
};
function weatherBackground(code, isDay) {
  let type = "clear";
  if (code >= 95) type = "storm";
  else if (code >= 51 && code <= 82) type = "rain";
  else if (code >= 71 && code <= 86) type = "snow";
  else if (code >= 45 && code <= 48) type = "fog";
  else if (code >= 2) type = "cloud";
  const key = type + (isDay ? "Day" : "Night");
  const colors = BG[key] || BG.clearDay;
  const root = document.documentElement;
  root.style.setProperty("--sky-top", colors[0]);
  root.style.setProperty("--sky-bottom", colors[1]);
  root.style.setProperty(
    "--sky-overlay",
    type === "clear"
      ? "radial-gradient(circle at 50% 16%, rgba(255, 233, 168, 0.45), transparent 22%), radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.12), transparent 28%), linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(16, 42, 76, 0.1) 56%, rgba(0, 0, 0, 0.05))"
      : type === "cloud"
        ? "radial-gradient(circle at 50% 14%, rgba(255, 255, 255, 0.18), transparent 24%), radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.08), transparent 26%), linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(18, 34, 52, 0.14) 58%, rgba(0, 0, 0, 0.08))"
        : "radial-gradient(circle at 50% 14%, rgba(255, 255, 255, 0.12), transparent 24%), linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(10, 25, 45, 0.16) 58%, rgba(0, 0, 0, 0.1))",
  );
  root.style.setProperty(
    "--sky-scene-opacity",
    type === "clear" ? "1" : type === "cloud" ? "0.92" : "0.86",
  );
  root.style.setProperty(
    "--sky-card-contrast",
    type === "clear" ? "0.22" : type === "cloud" ? "0.3" : "0.34",
  );
  root.style.setProperty(
    "--card-fill-start",
    type === "clear" ? "rgba(36, 88, 146, 0.28)" : type === "cloud" ? "rgba(42, 64, 92, 0.28)" : "rgba(31, 52, 79, 0.3)",
  );
  root.style.setProperty(
    "--card-fill-end",
    type === "clear" ? "rgba(20, 48, 83, 0.18)" : type === "cloud" ? "rgba(26, 39, 55, 0.2)" : "rgba(18, 30, 46, 0.24)",
  );
  root.style.setProperty(
    "--card-border",
    type === "clear" ? "rgba(255, 255, 255, 0.18)" : type === "cloud" ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.12)",
  );
  document.body.dataset.weatherType = type;
  document.body.dataset.daynight = isDay ? "day" : "night";
  document.body.dataset.weatherTheme = type;
  const scene = document.querySelector(".sky-scene");
  if (scene) scene.dataset.weather = type;
}
function applyWeatherBackground() {
  const w = window.meghdootGetWeather?.();
  if (!w?.current) return;
  weatherBackground(w.current.weather_code, !!w.current.is_day);
}
window.meghdootBackground = { apply: applyWeatherBackground };
document.addEventListener("DOMContentLoaded", applyWeatherBackground);
