const RV = { meta: "https://api.rainviewer.com/public/weather-maps.json" };
const Radar = {
  frames: [],
  index: 0,
  map: null,
  overlay: null,
  timer: null,
  loaded: false,
};
async function loadRadar() {
  const status = document.querySelector("#radarStatus");
  try {
    status && (status.textContent = "Loading radar…");
    const r = await fetch(RV.meta, { cache: "no-store" });
    if (!r.ok) throw Error(r.status);
    const data = await r.json();
    Radar.frames = data.radar?.past || [];
    if (!Radar.frames.length) throw Error("No radar frames");
    Radar.index = Radar.frames.length - 1;
    Radar.loaded = true;
    renderRadar();
    status &&
      (status.textContent = `Radar · ${Radar.frames.length} recent frames`);
  } catch (e) {
    console.error(e);
    status && (status.textContent = "Radar temporarily unavailable");
  }
}
function renderRadar() {
  const f = Radar.frames[Radar.index];
  if (!f) return;
  const { latitude, longitude } = window.meghdootGetPlace?.() || {};
  const host = "https://tilecache.rainviewer.com";
  const center = latitude && longitude ? `/${latitude}/${longitude}` : "";
  const url = `${host}${f.path}/512/7${center}/2/1_1.png`;
  const img = document.querySelector("#radarImage");
  if (img) img.src = url;
  const label = document.querySelector("#radarFrame");
  if (label)
    label.textContent = new Date(f.time * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  const slider = document.querySelector("#radarSlider");
  if (slider) {
    slider.max = Math.max(0, Radar.frames.length - 1);
    slider.value = Radar.index;
  }
}
function initRadar() {
  const slider = document.querySelector("#radarSlider");
  slider?.addEventListener("input", (e) => {
    Radar.index = Number(e.target.value);
    renderRadar();
  });
  document.querySelector("#radarPlay")?.addEventListener("click", () => {
    if (Radar.timer) {
      clearInterval(Radar.timer);
      Radar.timer = null;
      return;
    }
    Radar.timer = setInterval(() => {
      Radar.index = (Radar.index + 1) % Radar.frames.length;
      renderRadar();
    }, 900);
  });
  loadRadar();
}
window.meghdootRadar = { refresh: loadRadar };
document.addEventListener("DOMContentLoaded", initRadar);
