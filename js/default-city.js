(() => {
  const DEFAULT_CITY = {
    name: "Kolkata",
    latitude: 22.5726,
    longitude: 88.3639,
    timezone: "Asia/Kolkata",
    country: "India",
    admin1: "West Bengal",
  };

  // Only establish the default on first visit. A location chosen by the
  // user later remains stored and is not overwritten on every page load.
  try {
    const saved = JSON.parse(localStorage.getItem("meghdoot-place") || "null");
    if (
      !saved ||
      !Number.isFinite(Number(saved.latitude)) ||
      !Number.isFinite(Number(saved.longitude))
    ) {
      localStorage.setItem("meghdoot-place", JSON.stringify(DEFAULT_CITY));
    }
  } catch {
    localStorage.setItem("meghdoot-place", JSON.stringify(DEFAULT_CITY));
  }
})();
