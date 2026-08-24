const daily = [
  ["Today", "🌤️", "27°", "32°", 8],
  ["Tomorrow", "🌤️", "26°", "31°", 28],
  ["Wednesday", "🌧️", "26°", "31°", 48],
  ["Thursday", "⛅", "25°", "30°", 66],
  ["Friday", "🌦️", "25°", "30°", 82]
];

const hourly = [
  ["Now", "🌥️", "27°"],
  ["09:00", "🌤️", "28°"],
  ["12:00", "☀️", "31°"],
  ["15:00", "🌤️", "32°"],
  ["18:00", "🌥️", "29°"],
  ["21:00", "☁️", "27°"]
];

const dailyForecast = document.querySelector("#dailyForecast");
const hourlyForecast = document.querySelector("#hourlyForecast");

if (dailyForecast) {
  dailyForecast.innerHTML = daily.map(([name, icon, low, high, position]) => `
    <div class="day-row">
      <span class="day-name">${name}</span>
      <span class="weather-symbol" aria-hidden="true">${icon}</span>
      <span>${low}</span>
      <span class="range" aria-hidden="true"><i style="left:${position}%"></i></span>
      <span>${high}</span>
    </div>
  `).join("");
}

if (hourlyForecast) {
  hourlyForecast.innerHTML = hourly.map(([time, icon, temp]) => `
    <div class="hour">
      <span>${time}</span>
      <div aria-hidden="true">${icon}</div>
      <b>${temp}</b>
    </div>
  `).join("");
}

const date = new Date();
const dateElement = document.querySelector("#heroDate");
if (dateElement) {
  dateElement.textContent = new Intl.DateTimeFormat("en-IN", {
    weekday: "long", day: "numeric", month: "long"
  }).format(date);
}

const toast = document.querySelector("#toast");
let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    if (action === "location") showToast("Location selector will be connected in Phase 3.");
    if (action === "search") showToast("Location search will be connected in Phase 3.");
    if (action === "menu") showToast("More weather options coming soon.");
    if (action === "forecast") showToast("Detailed 5-day forecast is coming next.");
  });
});

document.querySelector(".alert-card")?.addEventListener("click", (event) => {
  if (event.target.closest("button")) showToast("Weather alert details coming soon.");
});
