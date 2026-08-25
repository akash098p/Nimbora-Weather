(() => {
  let last = "";
  function sync() {
    const w = window.meghdootGetWeather?.();
    const icon = window.meghdootRealWeatherIcons;
    if (!w?.current || !icon) return;
    const key = [w.current.weather_code, w.current.is_day].join(":");
    if (key !== last) {
      last = key;
      icon.render(w.current.weather_code, Boolean(w.current.is_day));
    }
  }
  sync();
  setInterval(sync, 250);
})();
