(() => {
  const $ = (s) => document.querySelector(s);
  let lastKey = "";
  let syncing = false;
  let lastRenderedHourKey = "";

  function hourWidth() {
    const card = $("#hourlyForecast .hour");
    return card
      ? Math.max(60, card.getBoundingClientRect().width)
      : window.innerWidth <= 600
        ? 78
        : 86;
  }
  function getWindow() {
    const data = window.meghdootGetWeather?.();
    if (!data?.hourly?.time?.length) return null;
    const now = data.current?.time || data.hourly.time[0];
    let start = data.hourly.time.findIndex((x) => new Date(x) >= new Date(now));
    if (start < 0) start = 0;
    const count = Math.min(24, data.hourly.time.length - start);
    return { data, start, count };
  }
  function iconFor(code) {
    const names = {
      0: "☀️",
      1: "🌤️",
      2: "⛅",
      3: "☁️",
      45: "🌫️",
      48: "🌫️",
      51: "🌦️",
      53: "🌦️",
      55: "🌧️",
      56: "🌧️",
      57: "🌧️",
      61: "🌦️",
      63: "🌧️",
      65: "🌧️",
      66: "🌧️",
      67: "🌧️",
      71: "🌨️",
      73: "❄️",
      75: "❄️",
      77: "🌨️",
      80: "🌦️",
      81: "🌧️",
      82: "🌧️",
      85: "🌨️",
      86: "❄️",
      95: "⛈️",
      96: "⛈️",
      99: "⛈️",
    };
    return names[Number(code)] || "🌡️";
  }
  function formatTime(iso, timezone) {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone || undefined,
    }).format(new Date(iso));
  }
  function renderHours(w) {
    const list = $("#hourlyForecast");
    if (!list) return;
    const { data, start, count } = w,
      tz = data.timezone || undefined,
      key = `${data.current?.time}|${start}|${count}|${data.hourly.time.slice(start, start + count).join(",")}`;
    if (key === lastRenderedHourKey) return;
    const old = list.scrollLeft;
    list.innerHTML = data.hourly.time
      .slice(start, start + count)
      .map((iso, i) => {
        const j = start + i,
          label = i === 0 ? "Now" : formatTime(iso, tz),
          v = Number(data.hourly.temperature_2m[j]),
          t = Number.isFinite(v) ? Math.round(v) : "--",
          rain = Math.round(
            Number(data.hourly.precipitation_probability?.[j] ?? 0),
          );
        return `<div class="hour"><span>${label}</span><div>${iconFor(data.hourly.weather_code[j])}</div><b>${t}°</b><small>💧 ${rain}%</small></div>`;
      })
      .join("");
    list.scrollLeft = old;
    lastRenderedHourKey = key;
    lastKey = "";
  }
  function draw() {
    const wrap = $(".chart-wrap"),
      svg = $(".chart"),
      line = $("#chartLine"),
      area = $("#chartArea"),
      high = $("#chartHigh"),
      low = $("#chartLow"),
      w = getWindow();
    if (!wrap || !svg || !line || !area || !w) return;
    renderHours(w);
    const { data, start, count } = w,
      width = hourWidth(),
      totalWidth = count * width,
      values = data.hourly.temperature_2m
        .slice(start, start + count)
        .map(Number),
      valid = values.filter(Number.isFinite);
    if (!valid.length) return;
    const max = Math.max(...valid),
      min = Math.min(...valid),
      span = Math.max(1, max - min),
      top = 20,
      bottom = 154,
      points = values.map((v, i) => [
        (i + 0.5) * width,
        Number.isFinite(v)
          ? bottom - ((v - min) / span) * (bottom - top)
          : bottom,
      ]);
    const path = points
      .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
      .join(" ");
    svg.setAttribute("viewBox", `0 0 ${totalWidth} 190`);
    svg.setAttribute("width", String(totalWidth));
    svg.style.width = `${totalWidth}px`;
    svg.style.minWidth = `${totalWidth}px`;
    line.setAttribute("d", path);
    area.setAttribute("d", `${path} V190 H0 Z`);
    let dots = svg.querySelector("#chartPoints");
    if (!dots) {
      dots = document.createElementNS("http://www.w3.org/2000/svg", "g");
      dots.id = "chartPoints";
      svg.appendChild(dots);
    }
    dots.innerHTML = points
      .map((p, i) => {
        const v = values[i];
        if (!Number.isFinite(v)) return "";
        const temp = Math.round(v);
        return `<g class="chart-point" tabindex="0"><circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="5.5"></circle><text x="${p[0].toFixed(1)}" y="${(p[1] - 10).toFixed(1)}" text-anchor="middle">${temp}°</text></g>`;
      })
      .join("");
    if (high) high.textContent = `${Math.round(max)}°`;
    if (low) low.textContent = `${Math.round(min)}°`;
    const key = `${data.current?.time}|${start}|${count}|${Math.round(max * 10)}|${Math.round(min * 10)}|${Math.round(width)}`;
    if (key !== lastKey) {
      lastKey = key;
      requestAnimationFrame(() => syncWidthAndScroll(false));
    }
  }
  function syncWidthAndScroll(fromChart) {
    const chartWrap = $(".chart-wrap"),
      list = $("#hourlyForecast");
    if (!chartWrap || !list || syncing) return;
    syncing = true;
    const source = fromChart ? chartWrap : list,
      target = fromChart ? list : chartWrap,
      maxSource = Math.max(1, source.scrollWidth - source.clientWidth),
      maxTarget = Math.max(1, target.scrollWidth - target.clientWidth);
    target.scrollLeft = (source.scrollLeft / maxSource) * maxTarget;
    syncing = false;
  }
  function init() {
    const chartWrap = $(".chart-wrap"),
      list = $("#hourlyForecast");
    if (!chartWrap || !list || chartWrap.dataset.hourlySyncReady) return;
    chartWrap.dataset.hourlySyncReady = "1";
    chartWrap.addEventListener("scroll", () => syncWidthAndScroll(true), {
      passive: true,
    });
    list.addEventListener("scroll", () => syncWidthAndScroll(false), {
      passive: true,
    });
    window.addEventListener("resize", () => {
      lastKey = "";
      lastRenderedHourKey = "";
      draw();
    });
    draw();
  }
  function boot() {
    init();
    draw();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setInterval(draw, 1500);
})();
