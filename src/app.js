const daily = [
  ["Today","🌤️","27°","32°"],
  ["Tomorrow","🌤️","26°","31°"],
  ["Wed","🌧️","26°","31°"],
  ["Thu","⛅","25°","30°"],
  ["Fri","🌦️","25°","30°"]
];

const hourly = [
  ["Now","🌥️","27°"],["09:00","🌤️","28°"],["12:00","☀️","31°"],
  ["15:00","🌤️","32°"],["18:00","🌥️","29°"],["21:00","☁️","27°"]
];

document.querySelector("#dailyForecast").innerHTML = daily.map((d,i)=>`
  <div class="day-row">
    <span>${d[0]}</span><span class="weather-symbol">${d[1]}</span>
    <span>${d[2]}</span><span class="range"><i style="left:${i*8}%"></i></span><span>${d[3]}</span>
  </div>`).join("");

document.querySelector("#hourlyForecast").innerHTML = hourly.map(h=>`
  <div class="hour"><span>${h[0]}</span><div>${h[1]}</div><b>${h[2]}</b></div>`).join("");