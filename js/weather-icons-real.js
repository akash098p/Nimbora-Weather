const RealWeatherIcons = (() => {
  const root = () => document.querySelector("#currentWeatherIcon");
  const esc = (s) =>
    String(s).replace(
      /[&<>\"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '\"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  const palette = {
    sun: "#FFD86A",
    moon: "#E8F1FF",
    cloud: "#F4F7FA",
    cloudShade: "#C9D5E1",
    rain: "#76C8FF",
    snow: "#FFFFFF",
    bolt: "#FFE66D",
    fog: "#DCE7EE",
  };
  function kind(code, isDay) {
    code = Number(code);
    if (code === 0) return isDay ? "clear-day" : "clear-night";
    if (code === 1) return isDay ? "mostly-clear-day" : "mostly-clear-night";
    if (code === 2) return isDay ? "partly-cloudy-day" : "partly-cloudy-night";
    if (code === 3) return "overcast";
    if (code === 45 || code === 48) return "fog";
    if (code >= 51 && code <= 57) return "drizzle";
    if (code >= 61 && code <= 67) return "rain";
    if (code >= 71 && code <= 77) return "snow";
    if (code >= 80 && code <= 82) return "showers";
    if (code >= 85 && code <= 86) return "snow-showers";
    if (code >= 95) return "thunderstorm";
    return "unknown";
  }
  function svg(type) {
    const defs = `<defs><linearGradient id="sun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFECA0"/><stop offset="1" stop-color="#FFB83E"/></linearGradient><linearGradient id="cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C9D5E1"/></linearGradient><linearGradient id="rain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9DE0FF"/><stop offset="1" stop-color="#4C9FEA"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
    const sun = `<g class="ri-sun"><circle cx="38" cy="38" r="20" fill="url(#sun)" filter="url(#glow)"/><g stroke="#FFD96A" stroke-width="3.5" stroke-linecap="round"><path d="M38 6v10M38 60v10M6 38h10M60 38h10M15 15l7 7M54 54l7 7M61 15l-7 7M22 54l-7 7"/></g></g>`;
    const moon = `<g class="ri-moon"><path d="M52 10c-13 4-22 15-22 29 0 17 14 30 31 30 8 0 15-3 20-8-4 1-8 2-12 1-17-2-28-18-25-34 1-7 4-13 8-18z" fill="${palette.moon}"/><circle cx="62" cy="28" r="3" fill="#C7D5EA"/><circle cx="50" cy="47" r="2" fill="#C7D5EA"/></g>`;
    const cloud = `<g class="ri-cloud"><path d="M20 71h62c12 0 22-8 22-19 0-11-9-20-20-20h-2C78 18 68 9 56 9 42 9 30 19 28 32 12 31 2 41 2 53c0 10 8 18 18 18z" fill="url(#cloud)"/></g>`;
    const rain = `<g class="ri-rain" stroke="url(#rain)" stroke-width="4" stroke-linecap="round"><path d="M25 82l-6 17"/><path d="M50 82l-6 17"/><path d="M75 82l-6 17"/></g>`;
    const snow = `<g class="ri-snow" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"><path d="M24 89v18M15 98h18M18 92l12 12M30 92L18 104"/><path d="M54 89v18M45 98h18M48 92l12 12M60 92L48 104"/><path d="M84 89v18M75 98h18M78 92l12 12M90 92L78 104"/></g>`;
    const bolt = `<path class="ri-bolt" d="M57 53H42l11-22H44l17-24-4 20h13z" fill="#FFE66D" stroke="#FFF3A8" stroke-width="1.5"/>`;
    const fog = `<g class="ri-fog" stroke="${palette.fog}" stroke-width="5" stroke-linecap="round"><path d="M12 84h86"/><path d="M20 97h72"/><path d="M30 110h55"/></g>`;
    let body = "";
    switch (type) {
      case "clear-day":
        body = sun;
        break;
      case "clear-night":
        body = moon;
        break;
      case "mostly-clear-day":
        body = sun + cloud;
        break;
      case "mostly-clear-night":
        body = moon + cloud;
        break;
      case "partly-cloudy-day":
        body = sun + cloud;
        break;
      case "partly-cloudy-night":
        body = moon + cloud;
        break;
      case "overcast":
        body =
          cloud +
          `<g class="ri-cloud-back"><path d="M34 64h50c11 0 20-8 20-18 0-9-7-17-17-18-4-10-13-16-24-16-10 0-19 6-23 15-14 0-24 9-24 20 0 9 8 17 18 17z" fill="${palette.cloudShade}" opacity=".85"/></g>`;
        break;
      case "fog":
        body = cloud + fog;
        break;
      case "drizzle":
      case "rain":
      case "showers":
        body = cloud + rain;
        break;
      case "snow":
      case "snow-showers":
        body = cloud + snow;
        break;
      case "thunderstorm":
        body = cloud + rain + bolt;
        break;
      default:
        body = sun;
    }
    return `<svg class="real-weather-svg" viewBox="0 0 110 120" aria-hidden="true">${defs}${body}</svg>`;
  }
  function render(code, isDay) {
    const e = root();
    if (!e) return;
    const t = kind(code, isDay);
    e.className = "weather-icon-large real-weather-icon";
    e.dataset.weather = t;
    e.innerHTML = svg(t);
    e.setAttribute("aria-label", t.replaceAll("-", " "));
  }
  return { render };
})();
window.nimboraRealWeatherIcons = RealWeatherIcons;
