(() => {
  const $ = (s) => document.querySelector(s);
  let lastKey = "";
  let syncing = false;

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

  function draw() {
    const wrap = $(".chart-wrap");
    const svg = $(".chart");
    const line = $("#chartLine");
    const area = $("#chartArea");
    const high = $("#chartHigh");
    const low = $("#chartLow");
    const windowData = getWindow();
    if (!wrap || !svg || !line || !area || !windowData) return;

    const { data, start, count } = windowData;
    const width = hourWidth();
    const totalWidth = count * width;
    const values = data.hourly.temperature_2m.slice(start, start + count).map(Number).filter(Number.isFinite);
    if (!values.length) return;

    const max = Math.max(...values);
    const min = Math.min(...values);
    const span = Math.max(1, max - min);
    const top = 18;
    const bottom = 158;
    const points = values.map((value, i) => [
      (i + 0.5) * width,
      bottom - ((value - min) / span) * (bottom - top),
    ]);
    const path = points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    const areaPath = `${path} V190 H0 Z`;

    svg.setAttribute("viewBox", `0 0 ${totalWidth} 190`);
    svg.setAttribute("width", String(totalWidth));
    svg.style.width = `${totalWidth}px`;
    svg.style.minWidth = `${totalWidth}px`;
    line.setAttribute("d", path);
    area.setAttribute("d", areaPath);
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
    target.scrollLeft = (source.scrollLeft / maxSource) * maxTarget;
    syncing = false;
  }

  function init() {
    const chartWrap = $(".chart-wrap");
    const list = $("#hourlyForecast");
    if (!chartWrap || !list || chartWrap.dataset.hourlySyncReady) return;
    chartWrap.dataset.hourlySyncReady = "1";
    chartWrap.addEventListener("scroll", () => syncWidthAndScroll(true), { passive: true });
    list.addEventListener("scroll", () => syncWidthAndScroll(false), { passive: true });
    window.addEventListener("resize", () => { lastKey = ""; draw(); });
    draw();
  }

  function boot() {
    init();
    draw();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setInterval(draw, 1000);
})();
