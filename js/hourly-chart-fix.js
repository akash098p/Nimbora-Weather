(() => {
  const $ = (s) => document.querySelector(s);
  let lastKey = "";
  let syncing = false;
  let lastRenderedHourKey = "";

  function hourWidth() {
    const card = $("#hourlyForecast .hour");
    return card ? Math.max(60, card.getBoundingClientRect().width) : (window.innerWidth <= 600 ? 78 : 86);
  }

  function getWindow() {
    const data = window.nimboraGetWeather?.();
    if (!data?.hourly?.time?.length) return null;
    const now = data.current?.time || data.hourly.time[0];
    let start = data.hourly.time.findIndex((x) => new Date(x) >= new Date(now));
    if (start < 0) start = 0;
    const count = Math.min(24, data.hourly.time.length - start);
    return { data, start, count };
  }

  function iconFor(code) {
    const names = {0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",51:"🌦️",53:"🌦️",55:"🌧️",56:"🌧️",57:"🌧️",61:"🌦️",63:"🌧️",65:"🌧️",66:"🌧️",67:"🌧️",71:"🌨️",73:"❄️",75:"❄️",77:"🌨️",80:"🌦️",81:"🌧️",82:"🌧️",85:"🌨️",86:"❄️",95:"⛈️",96:"⛈️",99:"⛈️"};
    return names[Number(code)] || "🌡️";
  }

  function formatTime(iso, timezone) {
    return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: timezone || undefined }).format(new Date(iso));
  }

  function renderHours(windowData) {
    const list = $("#hourlyForecast");
    if (!list) return;
    const { data, start, count } = windowData;
    const tz = data.timezone || undefined;
    const key = `${data.current?.time}|${start}|${count}|${data.hourly.time.slice(start, start + count).join(",")}`;
    if (key === lastRenderedHourKey) return;
    const oldScroll = list.scrollLeft;
    list.innerHTML = data.hourly.time.slice(start, start + count).map((iso, i) => {
      const j = start + i;
      const label = i === 0 ? "Now" : formatTime(iso, tz);
      const value = Number(data.hourly.temperature_2m[j]);
      const temp = Number.isFinite(value) ? Math.round(value) : "--";
      const rain = Math.round(Number(data.hourly.precipitation_probability?.[j] ?? 0));
      return `<div class="hour"><span>${label}</span><div>${iconFor(data.hourly.weather_code[j])}</div><b>${temp}°</b><small>💧 ${rain}%</small></div>`;
    }).join("");
    list.scrollLeft = oldScroll;
    lastRenderedHourKey = key;
    lastKey = "";
  }

  function draw() {
    const wrap = $(".chart-wrap");
    const svg = $(".chart");
    const line = $("#chartLine");
    const area = $("#chartArea");
    const high = $("#chartHigh");
    const low = $("#chartLow");
    const windowData = getWindow();
    if (!wrap || !svg || !line || !area || !windowData) return;
    renderHours(windowData);
    const { data, start, count } = windowData;
    const width = hourWidth();
    const totalWidth = count * width;
    const values = data.hourly.temperature_2m.slice(start, start + count).map(Number).filter(Number.isFinite);
    if (!values.length) return;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const span = Math.max(1, max - min);
    const top = 18, bottom = 158;
    const points = values.map((value, i) => [(i + 0.5) * width, bottom - ((value - min) / span) * (bottom - top)]);
    const path = points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    svg.setAttribute("viewBox", `0 0 ${totalWidth} 190`);
    svg.setAttribute("width", String(totalWidth));
    svg.style.width = `${totalWidth}px`;
    svg.style.minWidth = `${totalWidth}px`;
    line.setAttribute("d", path);
    area.setAttribute("d", `${path} V190 H0 Z`);
    if (high) high.textContent = `${Math.round(max)}°`;
    if (low) low.textContent = `${Math.round(min)}°`;
    const key = `${data.current?.time}|${start}|${count}|${Math.round(max * 10)}|${Math.round(min * 10)}|${Math.round(width)}`;
    if (key !== lastKey) {
      lastKey = key;
      requestAnimationFrame(() => syncWidthAndScroll(false));
    }
  }

  function syncWidthAndScroll(fromChart) {
    const chartWrap = $(".chart-wrap");
    const list = $("#hourlyForecast");
    if (!chartWrap || !list || syncing) return;
    syncing = true;
    const source = fromChart ? chartWrap : list;
    const target = fromChart ? list : chartWrap;
    const maxSource = Math.max(1, source.scrollWidth - source.clientWidth);
    const maxTarget = Math.max(1, target.scrollWidth - target.clientWidth);
    target.scrollLeft = maxSource > 0 ? (source.scrollLeft / maxSource) * maxTarget : 0;
    syncing = false;
  }

  function init() {
    const chartWrap = $(".chart-wrap"), list = $("#hourlyForecast");
    if (!chartWrap || !list || chartWrap.dataset.hourlySyncReady) return;
    chartWrap.dataset.hourlySyncReady = "1";
    chartWrap.addEventListener("scroll", () => syncWidthAndScroll(true), { passive: true });
    list.addEventListener("scroll", () => syncWidthAndScroll(false), { passive: true });
    window.addEventListener("resize", () => { lastKey = ""; lastRenderedHourKey = ""; draw(); });
    draw();
  }
  function boot() { init(); draw(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  setInterval(draw, 1500);
})();
